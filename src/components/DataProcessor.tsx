"use client"

import React, { useState, useRef, useEffect } from 'react';
import { Send, HelpCircle, User, FileText, ChevronDown, ChevronRight, Settings, Check, Clock } from 'lucide-react';

// 型定義
interface StudentData {
  id: string;
  firstEventDate: string;
  enrollmentDate: string;
  schoolName: string;
}

interface Message {
  id: number;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  data?: StudentData[];
}

interface ProcessingStep {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  details: string[];
  status: 'completed' | 'processing' | 'pending';
}

interface DataTableProps {
  data: StudentData[];
}

const DataProcessor: React.FC = () => {

  useEffect(() => {
    async function fetchPosts() {
      const res = await fetch('/api/test')
      const data = await res.json()
      console.log(data)
    }
    fetchPosts()
  }, [])

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      type: 'user',
      content: '生徒ID毎に初回イベント日、入学日、学校名を出して。',
      timestamp: new Date()
    },
    {
      id: 2,
      type: 'assistant',
      content: 'データを処理しました。以下が結果です：',
      timestamp: new Date(),
      data: [
        { id: 'S001', firstEventDate: '2024-04-15', enrollmentDate: '2024-04-01', schoolName: '東京大学' },
        { id: 'S002', firstEventDate: '2024-04-22', enrollmentDate: '2024-04-01', schoolName: '京都大学' },
        { id: 'S003', firstEventDate: '2024-04-18', enrollmentDate: '2024-04-01', schoolName: '大阪大学' },
        { id: 'S004', firstEventDate: '2024-04-25', enrollmentDate: '2024-04-01', schoolName: '東北大学' },
        { id: 'S005', firstEventDate: '2024-04-20', enrollmentDate: '2024-04-01', schoolName: '九州大学' },
        { id: 'S006', firstEventDate: '2024-04-12', enrollmentDate: '2024-04-01', schoolName: '北海道大学' },
        { id: 'S007', firstEventDate: '2024-04-28', enrollmentDate: '2024-04-01', schoolName: '名古屋大学' },
        { id: 'S008', firstEventDate: '2024-04-16', enrollmentDate: '2024-04-01', schoolName: '慶應義塾大学' },
        { id: 'S009', firstEventDate: '2024-04-19', enrollmentDate: '2024-04-01', schoolName: '早稲田大学' },
        { id: 'S010', firstEventDate: '2024-04-23', enrollmentDate: '2024-04-01', schoolName: '一橋大学' },
        { id: 'S011', firstEventDate: '2024-04-14', enrollmentDate: '2024-04-01', schoolName: '東京工業大学' },
        { id: 'S012', firstEventDate: '2024-04-17', enrollmentDate: '2024-04-01', schoolName: '筑波大学' },
        { id: 'S013', firstEventDate: '2024-04-21', enrollmentDate: '2024-04-01', schoolName: '神戸大学' },
        { id: 'S014', firstEventDate: '2024-04-26', enrollmentDate: '2024-04-01', schoolName: '広島大学' },
        { id: 'S015', firstEventDate: '2024-04-13', enrollmentDate: '2024-04-01', schoolName: '岡山大学' }
      ]
    },
    {
      id: 3,
      type: 'user', 
      content: '重複データはありますか？',
      timestamp: new Date(Date.now() - 300000)
    },
    {
      id: 4,
      type: 'assistant',
      content: '重複データをチェックしました。生徒ID S004 が2回出現していることを確認しました。重複を削除して再処理します。',
      timestamp: new Date(Date.now() - 240000),
      data: [
        { id: 'S001', firstEventDate: '2024-04-15', enrollmentDate: '2024-04-01', schoolName: '東京大学' },
        { id: 'S002', firstEventDate: '2024-04-22', enrollmentDate: '2024-04-01', schoolName: '京都大学' },
        { id: 'S003', firstEventDate: '2024-04-18', enrollmentDate: '2024-04-01', schoolName: '大阪大学' },
        { id: 'S004', firstEventDate: '2024-04-25', enrollmentDate: '2024-04-01', schoolName: '東北大学' },
        { id: 'S005', firstEventDate: '2024-04-20', enrollmentDate: '2024-04-01', schoolName: '九州大学' }
      ]
    }
  ]);
  
  const [inputMessage, setInputMessage] = useState<string>('');
  const [selectedStep, setSelectedStep] = useState<number>(4);
  const [expandedStep, setExpandedStep] = useState<number | null>(null);
  const [showAdjustment, setShowAdjustment] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const processingSteps: ProcessingStep[] = [
    { 
      id: 1, 
      title: 'データクリーニング', 
      subtitle: 'ステップ 1',
      description: '生データから不要な文字や空白を除去し、データの整合性をチェックします。重複レコードの検出と削除、欠損値の処理、データ型の統一を行います。',
      details: [
        '空白文字の除去とトリミング',
        '重複データの検出（ID重複など）',
        '欠損値の補完または削除',
        '不正な文字コードの修正'
      ],
      status: 'completed'
    },
    { 
      id: 2, 
      title: 'データ変換', 
      subtitle: 'ステップ 2',
      description: 'データを分析しやすい形式に変換します。日付フォーマットの統一、カテゴリデータの正規化、数値データの標準化などを実行します。',
      details: [
        '日付フォーマットをYYYY-MM-DD形式に統一',
        'カテゴリ名の表記揺れを修正',
        '数値データの単位統一',
        'エンコーディングの統一'
      ],
      status: 'completed'
    },
    { 
      id: 3, 
      title: 'データ結合', 
      subtitle: 'ステップ 3',
      description: '複数のデータソースを結合して、包括的なデータセットを作成します。生徒IDをキーとして、イベントデータと学籍データをマージします。',
      details: [
        '生徒IDをキーとした内部結合',
        '学校マスタデータとの照合',
        'イベント履歴の時系列整理',
        '結合後のデータ整合性チェック'
      ],
      status: 'completed'
    },
    { 
      id: 4, 
      title: 'データ集約', 
      subtitle: 'ステップ 4',
      description: '生徒ID毎に初回イベント日を特定し、入学日と併せて集約します。各生徒の最初のアクティビティを明確にして、分析用データセットを完成させます。',
      details: [
        '生徒ID毎の初回イベント日を算出',
        '入学日との時系列比較',
        '学校名の正式名称取得',
        '最終データセットの構築'
      ],
      status: 'processing'
    }
  ];

  const scrollToBottom = (): void => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (): void => {
    if (!inputMessage.trim()) return;

    const newUserMessage: Message = {
      id: messages.length + 1,
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    const newAssistantMessage: Message = {
      id: messages.length + 2,
      type: 'assistant',
      content: 'データを更新しています...',
      timestamp: new Date(),
      data: [
        { id: 'S001', firstEventDate: '2024-04-15', enrollmentDate: '2024-04-01', schoolName: '東京大学' },
        { id: 'S002', firstEventDate: '2024-04-22', enrollmentDate: '2024-04-01', schoolName: '京都大学' },
        { id: 'S003', firstEventDate: '2024-04-18', enrollmentDate: '2024-04-01', schoolName: '大阪大学' },
        { id: 'S016', firstEventDate: '2024-04-30', enrollmentDate: '2024-04-01', schoolName: '横浜国立大学' },
      ]
    };

    setMessages(prev => [...prev, newUserMessage, newAssistantMessage]);
    setInputMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>): void => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const DataTable: React.FC<DataTableProps> = ({ data }) => (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden mt-3">
      <table className="w-full text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-2 text-left font-medium text-gray-900">生徒ID</th>
            <th className="px-4 py-2 text-left font-medium text-gray-900">初回イベント日</th>
            <th className="px-4 py-2 text-left font-medium text-gray-900">入学日</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {data.map((row, index) => (
            <tr key={index} className="hover:bg-gray-50">
              <td className="px-4 py-2 text-gray-900">{row.id}</td>
              <td className="px-4 py-2 text-blue-600">{row.firstEventDate}</td>
              <td className="px-4 py-2 text-blue-600">{row.enrollmentDate}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="h-screen bg-white flex">
      {/* チャット部分 */}
      <div className="flex-1 flex flex-col">
        {/* ヘッダー */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-gray-800 rounded flex items-center justify-center">
              <FileText className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-xl font-medium text-gray-900">Data Processor</h1>
          </div>
          <div className="flex items-center gap-4">
            <HelpCircle className="w-5 h-5 text-gray-500" />
            <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
          </div>
        </div>

        {/* メッセージエリア */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((message) => (
            <div key={message.id} className="flex gap-4">
              <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0">
                {message.type === 'user' ? (
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                ) : (
                  <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center">
                    <FileText className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-gray-900">
                    {message.type === 'user' ? 'You' : 'Data Processor'}
                  </span>
                  <span className="text-xs text-gray-500">
                    {message.timestamp.toLocaleTimeString()}
                  </span>
                </div>
                
                <div className="text-gray-700 leading-relaxed">
                  {message.content}
                </div>
                
                {message.data && <DataTable data={message.data} />}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* 入力エリア */}
        <div className="border-t border-gray-200 p-6">
          <div className="relative">
            <textarea
              ref={textareaRef}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full min-h-[60px] max-h-32 p-4 pr-12 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="データの変更や追加の処理について質問してください..."
              rows={2}
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim()}
              className="absolute bottom-3 right-3 p-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white rounded-lg transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
          <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
            <span>Enter で送信、Shift + Enter で改行</span>
          </div>
        </div>
      </div>

      {/* サイドバー - 固定高さ */}
      <div className="w-96 bg-gray-50 border-l border-gray-200 h-screen flex flex-col">
        {/* サイドバーヘッダー */}
        <div className="p-6 flex-shrink-0">
          <h3 className="text-lg font-semibold text-gray-900">データ処理ステップ</h3>
        </div>
        
        {/* スクロール可能なコンテンツエリア */}
        <div className="flex-1 overflow-y-auto px-6">
          <div className="space-y-4">
            {processingSteps.map((step) => (
              <div key={step.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                {/* ステップヘッダー */}
                <div
                  className={`flex items-center gap-3 p-4 cursor-pointer transition-colors ${
                    selectedStep === step.id ? 'bg-blue-50 border-b border-blue-200' : 'hover:bg-gray-50'
                  }`}
                  onClick={() => setSelectedStep(step.id)}
                >
                  <div className="w-8 h-8 bg-white border border-gray-200 rounded flex items-center justify-center">
                    {step.status === 'completed' ? (
                      <Check className="w-4 h-4 text-green-600" />
                    ) : step.status === 'processing' ? (
                      <Clock className="w-4 h-4 text-blue-600" />
                    ) : (
                      <FileText className="w-4 h-4 text-gray-600" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{step.title}</div>
                    <div className="text-sm text-gray-500">{step.subtitle}</div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setExpandedStep(expandedStep === step.id ? null : step.id);
                    }}
                    className="p-1 hover:bg-gray-200 rounded"
                  >
                    {expandedStep === step.id ? (
                      <ChevronDown className="w-4 h-4 text-gray-600" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-gray-600" />
                    )}
                  </button>
                </div>

                {/* ステップ詳細 */}
                {expandedStep === step.id && (
                  <div className="p-4 border-t border-gray-200 bg-gray-50">
                    <div className="text-sm text-gray-700 mb-4 leading-relaxed">
                      {step.description}
                    </div>
                    
                    <div className="mb-4">
                      <h5 className="font-medium text-gray-900 mb-2">処理内容:</h5>
                      <ul className="space-y-1">
                        {step.details.map((detail, index) => (
                          <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                            <span className="w-1 h-1 bg-gray-400 rounded-full mt-2 flex-shrink-0"></span>
                            {detail}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => setShowAdjustment(showAdjustment === step.id ? null : step.id)}
                        className="flex items-center gap-2 px-3 py-2 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                      >
                        <Settings className="w-4 h-4" />
                        微調整
                      </button>
                      <button className="px-3 py-2 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors">
                        再実行
                      </button>
                    </div>

                    {/* 微調整パネル */}
                    {showAdjustment === step.id && (
                      <div className="mt-4 p-3 bg-white border border-gray-200 rounded-md">
                        <h6 className="font-medium text-gray-900 mb-3">調整オプション</h6>
                        {step.id === 1 && (
                          <div className="space-y-3">
                            <label className="flex items-center gap-2">
                              <input type="checkbox" defaultChecked className="rounded" />
                              <span className="text-sm">重複データを自動削除</span>
                            </label>
                            <label className="flex items-center gap-2">
                              <input type="checkbox" defaultChecked className="rounded" />
                              <span className="text-sm">空白文字をトリミング</span>
                            </label>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                欠損値の処理方法:
                              </label>
                              <select className="w-full p-2 text-sm border border-gray-300 rounded">
                                <option>削除する</option>
                                <option>平均値で補完</option>
                                <option>前の値で補完</option>
                              </select>
                            </div>
                          </div>
                        )}
                        {step.id === 2 && (
                          <div className="space-y-3">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                日付フォーマット:
                              </label>
                              <select className="w-full p-2 text-sm border border-gray-300 rounded">
                                <option>YYYY-MM-DD</option>
                                <option>MM/DD/YYYY</option>
                                <option>DD/MM/YYYY</option>
                              </select>
                            </div>
                            <label className="flex items-center gap-2">
                              <input type="checkbox" defaultChecked className="rounded" />
                              <span className="text-sm">カテゴリ名を統一</span>
                            </label>
                          </div>
                        )}
                        {step.id === 3 && (
                          <div className="space-y-3">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                結合方式:
                              </label>
                              <select className="w-full p-2 text-sm border border-gray-300 rounded">
                                <option>内部結合 (Inner Join)</option>
                                <option>左結合 (Left Join)</option>
                                <option>完全結合 (Full Join)</option>
                              </select>
                            </div>
                            <label className="flex items-center gap-2">
                              <input type="checkbox" defaultChecked className="rounded" />
                              <span className="text-sm">結合後の整合性チェック</span>
                            </label>
                          </div>
                        )}
                        {step.id === 4 && (
                          <div className="space-y-3">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                集約方法:
                              </label>
                              <select className="w-full p-2 text-sm border border-gray-300 rounded">
                                <option>最初のイベント日</option>
                                <option>最後のイベント日</option>
                                <option>すべてのイベント日</option>
                              </select>
                            </div>
                            <label className="flex items-center gap-2">
                              <input type="checkbox" defaultChecked className="rounded" />
                              <span className="text-sm">学校名を正式名称で表示</span>
                            </label>
                          </div>
                        )}
                        <div className="flex gap-2 mt-4">
                          <button className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600">
                            適用
                          </button>
                          <button 
                            onClick={() => setShowAdjustment(null)}
                            className="px-3 py-1 text-sm bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                          >
                            キャンセル
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* サイドバーフッター - 固定 */}
        <div className="p-6 flex-shrink-0 border-t border-gray-200">
          {/* 現在の処理状況 */}
          <div className="p-4 bg-blue-50 rounded-lg mb-4">
            <h4 className="font-medium text-blue-900 mb-2">現在の処理状況</h4>
            <div className="text-sm text-blue-700">
              <div>処理済み行数: 5</div>
              <div>最終更新: {new Date().toLocaleTimeString()}</div>
              <div className="mt-2">
                <div className="flex items-center gap-2">
                  <div className="w-full bg-blue-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{width: '75%'}}></div>
                  </div>
                  <span className="text-xs">75%</span>
                </div>
              </div>
            </div>
          </div>

          {/* 実行ボタン */}
          <button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-4 rounded-lg transition-colors">
            すべてのステップを実行
          </button>
        </div>
      </div>
    </div>
  );
};

export default DataProcessor;