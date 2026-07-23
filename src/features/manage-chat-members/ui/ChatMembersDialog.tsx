// // src/features/manage-chat-members/ui/ChatMembersDialog.tsx
// "use client";

// import { Button } from "@/shared/ui/button";
// import { DialogContent, DialogTitle } from "@/shared/ui/dialog";
// import {
//   useAddChatMember,
//   useRemoveChatMember,
// } from "../api/useChatMembersMutations";

// interface EmployeeInChat {
//   profileId: string;
//   name: string;
//   isInChat: boolean;
// }

// interface ChatMembersDialogProps {
//   currentChatId: string;
//   employeesInOrg: EmployeeInChat[];
// }

// export const ChatMembersDialog = ({
//   currentChatId,
//   employeesInOrg,
// }: ChatMembersDialogProps) => {
//   const { mutate: addMember } = useAddChatMember();
//   const { mutate: removeMember } = useRemoveChatMember();

//   return (
//     <DialogContent className="sm:max-w-[425px] rounded-2xl">
//       <DialogTitle className="text-sm font-semibold tracking-wide uppercase text-muted-foreground">
//         Участники обсуждения
//       </DialogTitle>

//       <div className="space-y-3 pt-4 max-h-[300px] overflow-y-auto pr-1">
//         {employeesInOrg.length === 0 ? (
//           <div className="text-center text-xs text-muted-foreground py-4">
//             В этой организации пока нет доступных сотрудников
//           </div>
//         ) : (
//           employeesInOrg.map((employee) => {
//             const isAlreadyInChat = employee.isInChat;

//             return (
//               <div
//                 key={employee.profileId}
//                 className="flex items-center justify-between p-2 rounded-xl border border-border/40 bg-muted/5 hover:bg-muted/10 transition-colors"
//               >
//                 <span className="text-sm font-medium truncate max-w-[220px]">
//                   {employee.name}
//                 </span>

//                 {isAlreadyInChat ? (
//                   <Button
//                     variant="ghost"
//                     size="sm"
//                     className="rounded-lg h-8 text-xs text-destructive hover:text-destructive hover:bg-destructive/5 font-medium px-3"
//                     onClick={() =>
//                       removeMember({
//                         chatId: currentChatId,
//                         targetProfileId: employee.profileId,
//                       })
//                     }
//                   >
//                     Исключить
//                   </Button>
//                 ) : (
//                   // 🟢 Кнопка добавления участника
//                   <Button
//                     size="sm"
//                     className="rounded-lg h-8 text-xs font-medium px-4"
//                     onClick={() =>
//                       addMember({
//                         chatId: currentChatId,
//                         targetProfileId: employee.profileId,
//                       })
//                     }
//                   >
//                     Добавить
//                   </Button>
//                 )}
//               </div>
//             );
//           })
//         )}
//       </div>
//     </DialogContent>
//   );
// };

// export default ChatMembersDialog;
