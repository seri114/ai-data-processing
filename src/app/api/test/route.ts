export async function GET(request: Request) {
    const req = await request.blob()
    const s = await req.text()
    return Response.json({"body": s})
}