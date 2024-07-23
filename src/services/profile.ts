import { Request, Response } from "express";
import { prismaClient } from "..";

// get user profile
export const getProfile = async (req: Request, res: Response) => {
  try {
    const user = await prismaClient.user.findFirst({
      where: {
        id: req.userId,
      },
      include: {
        profile: true,
      },
    });
    res.json(user);
  } catch (error) {
    res.status(404).json({ message: "User is not found" });
    return;
  }
};

// update user profile
export const updateProfile = async (req: Request, res: Response) => {
  const { bio } = req.body;

  try {
    const profile = await prismaClient.profile.update({
      where: {
        userId: req.userId,
      },
      data: {
        bio,
      },
    });
    res.json(profile);
  } catch (error) {
    res.status(404).json({ message: "Profile is not found" });
    return;
  }
};
