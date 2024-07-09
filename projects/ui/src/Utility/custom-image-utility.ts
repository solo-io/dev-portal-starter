export const useGetImageURL = (
  metadata: Record<string, string> | undefined | null,
  backupImageType: "tacos" | undefined = undefined
) => {
  const tacosURL =
    "https://img.huffingtonpost.com/asset/57f2730f170000f70aac9059.jpeg?ops=scalefit_960_noupscale";
  const backupImageURL = backupImageType === "tacos" ? tacosURL : undefined;
  return metadata?.imageURL ?? backupImageURL;
};
