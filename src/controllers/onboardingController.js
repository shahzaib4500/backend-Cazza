import { prisma } from "../config/db.js";

export const completeOnboarding = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId)
      return res.status(401).json({ message: "Unauthorized: Missing user ID" });

    const {
      businessName,
      businessEntityType,
      annualRevenueBand,
      marketplaces,
      techStack,
    } = req.body;

    // Find user
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { businessInformation: true },
    });

    if (!user) return res.status(404).json({ message: "User not found" });
    if (!user.verified)
      return res.status(400).json({ message: "User email not verified yet" });

    // Check if user already has business information
    if (user.businessInformation) {
      return res
        .status(400)
        .json({ message: "User has already completed onboarding" });
    }

    // Create new business info record
    const businessInfo = await prisma.businessInformation.create({
      data: {
        userId,
        businessName,
        businessEntityType,
        annualRevenueBand,
        marketplaces,
        useXero: techStack.useXero,
        multipleCurrencies: techStack.multipleCurrencies,
      },
    });

    // Update user onboarded status
    await prisma.user.update({
      where: { id: userId },
      data: { onboarded: "VERIFIED" },
    });

    //Respond success
    res.status(201).json({
      message: "Onboarding completed successfully",
      businessInformation: businessInfo,
    });
  } catch (error) {
    console.error("Onboarding error:", error);
    res.status(500).json({
      message: "Failed to complete onboarding",
    });
  }
};
