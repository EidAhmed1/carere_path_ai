import { NextResponse } from "next/server";
import { getPaths, createPath } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const paths = await getPaths();
    return NextResponse.json(paths);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    if (!body.id || !body.titleAr) {
      return NextResponse.json({ error: "لازم يكون فيه id واسم عربي على الأقل" }, { status: 400 });
    }
    const created = await createPath(body);
    return NextResponse.json(created, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
