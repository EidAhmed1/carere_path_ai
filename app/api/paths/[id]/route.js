import { NextResponse } from "next/server";
import { updatePath, deletePath } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function PUT(req, { params }) {
  try {
    const body = await req.json();
    const updated = await updatePath(params.id, body);
    if (!updated) {
      return NextResponse.json({ error: "المسار غير موجود" }, { status: 404 });
    }
    return NextResponse.json(updated);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    await deletePath(params.id);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
