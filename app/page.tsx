'use client'
import { DataTable } from "@/components/UserTable/data-table";
import { Table } from "@/components/ui/table";
import Image from "next/image";
import { columns } from "@/components/UserTable/columns";
import { useStore } from "@/utility/store/useStore";



export default function Home() {
  const users = useStore(state => state.users)

  return (
    <main className="flex flex-col items-center justify-center w-screen h-screen space-y-4">
      <DataTable columns={columns} data={users} />
    </main>
  );
}
