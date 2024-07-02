export const useGetImageUrl = (
  metadata: Record<string, string> | undefined,
  backupImageType: "tacos" | "none" = "none"
) => {
  const tacosUrl =
    "https://img.huffingtonpost.com/asset/57f2730f170000f70aac9059.jpeg?ops=scalefit_960_noupscale";
  const backupImageUrl = backupImageType === "tacos" ? tacosUrl : undefined;
  return metadata?.imageUrl ?? backupImageUrl;
};
