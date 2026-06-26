import { getOrganization } from "@/entities/organization/api/getOrganization";
import OrganizationForm from "@/widgets/organization-form/OrganizationForm";
import { notFound } from "next/navigation";
import { DataTable } from '@/shared/ui/custom/DataTable';
import WrapperHeaderScreen from '@/shared/ui/custom/WrapperHeaderScreen';
import { columns, Employee } from '@/widgets/employees-table/columns';
import { OrgRole } from '@prisma/client';

export const mockEmployees: Employee[] = [
  {
    id: "1",
    name: "Иванов Иван Иванович",
    email: "ivanov@company.ru",
    phone: "+7 (999) 123-45-67",
    position: "Генеральный директор",
    role: OrgRole.RESPONSIBLE,
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-06-20T14:22:00Z",
  },
  {
    id: "2",
    name: "Петрова Анна Сергеевна",
    email: "petrova@company.ru",
    phone: "+7 (999) 234-56-78",
    position: "Финансовый директор",
    role: OrgRole.MEMBER,
    createdAt: "2024-02-01T09:15:00Z",
    updatedAt: "2024-06-18T11:45:00Z",
  },
  {
    id: "3",
    name: "Сидоров Алексей Владимирович",
    email: "sidorov@company.ru",
    phone: "+7 (999) 345-67-89",
    position: "Менеджер по продажам",
    role: OrgRole.MEMBER,
    createdAt: "2024-03-10T08:45:00Z",
    updatedAt: "2024-06-22T16:30:00Z",
  },
  {
    id: "4",
    name: "Козлова Мария Дмитриевна",
    email: "kozlova@company.ru",
    phone: "+7 (999) 456-78-90",
    position: "HR-менеджер",
    role: OrgRole.MEMBER,
    createdAt: "2024-01-20T11:00:00Z",
    updatedAt: "2024-06-19T09:15:00Z",
  },
  {
    id: "5",
    name: "Николаев Дмитрий Александрович",
    email: "nikolaev@company.ru",
    phone: "+7 (999) 567-89-01",
    position: "Технический директор",
    role: OrgRole.MEMBER,
    createdAt: "2024-02-15T13:20:00Z",
    updatedAt: "2024-06-21T10:45:00Z",
  },
  {
    id: "6",
    name: "Федорова Елена Павловна",
    email: "fedorova@company.ru",
    phone: "+7 (999) 678-90-12",
    position: "Бухгалтер",
    role: OrgRole.MEMBER,
    createdAt: "2024-04-05T10:30:00Z",
    updatedAt: "2024-06-23T14:00:00Z",
  },
  {
    id: "7",
    name: "Морозов Сергей Игоревич",
    email: "morozov@company.ru",
    phone: "+7 (999) 789-01-23",
    position: "Разработчик",
    role: OrgRole.MEMBER,
    createdAt: "2024-05-12T09:45:00Z",
    updatedAt: "2024-06-22T17:20:00Z",
  },
  {
    id: "8",
    name: "Волкова Ольга Николаевна",
    email: "volkova@company.ru",
    phone: "+7 (999) 890-12-34",
    position: "Маркетолог",
    role: OrgRole.MEMBER,
    createdAt: "2024-03-25T14:10:00Z",
    updatedAt: "2024-06-20T12:35:00Z",
  },
  {
    id: "9",
    name: "Соколов Андрей Викторович",
    email: "sokolov@company.ru",
    phone: "+7 (999) 901-23-45",
    position: "Менеджер проектов",
    role: OrgRole.MEMBER,
    createdAt: "2024-02-28T11:55:00Z",
    updatedAt: "2024-06-23T09:50:00Z",
  },
  {
    id: "10",
    name: "Лебедева Татьяна Михайловна",
    email: "lebedeva@company.ru",
    phone: "+7 (999) 012-34-56",
    position: "Дизайнер",
    role: OrgRole.MEMBER,
    createdAt: "2024-06-01T08:30:00Z",
    updatedAt: "2024-06-23T16:40:00Z",
  },
  {
    id: "11",
    name: "Кузнецов Павел Олегович",
    email: "kuznetsov@company.ru",
    phone: "+7 (999) 111-22-33",
    position: "Системный администратор",
    role: OrgRole.MEMBER,
    createdAt: "2024-04-18T10:15:00Z",
    updatedAt: "2024-06-21T13:25:00Z",
  },
  {
    id: "12",
    name: "Попова Наталья Андреевна",
    email: "popova@company.ru",
    phone: "+7 (999) 222-33-44",
    position: "Юрист",
    role: OrgRole.MEMBER,
    createdAt: "2024-05-20T12:40:00Z",
    updatedAt: "2024-06-22T15:55:00Z",
  },
];


const OrganizationPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  
  const organization = await getOrganization(id);
  
  if (!organization) {
    notFound();
  }

  return (
    <div className="flex flex-col items-center w-full h-full">
      <OrganizationForm organization={organization} />
      <DataTable columns={columns} data={mockEmployees} />
    </div>
  );
};

export default OrganizationPage;
