// import { redirect } from "next/navigation";
// import prisma from "./prisma-client";

// export const inititlaProfile = async () => {
//   try {
//     const user = await currentUser();

//     if (!user) {
//       return redirect("/login");
//     }

//     const profile = await prisma.profile.findUnique({
//       where: {
//         userId: user.id,
//       },
//     });

//     if (!profile) {
//       return profile;
//     }
//     const newProfile = await prisma.profile.create({
//       data: {
//         userId: user.id,
//         name: user.name,
//         imageUrl: user.imageUrl,
//         email: user.email,
//       },
//     });

//     return newProfile;
//   } catch (error) {
//     console.log(error);
//   }
// };
