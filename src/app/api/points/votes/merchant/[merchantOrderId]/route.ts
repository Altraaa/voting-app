import { pointVotesController } from "@/config/controllers/pointVotesController";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ merchantOrderId: string }> }
) {
  const { merchantOrderId } = await params;
  return pointVotesController.getByMerchantOrderId(merchantOrderId);
}