'use client'
import { ColumnDef } from "@tanstack/react-table";
import { type User } from "@/utility/types";
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { CircleCheck, CircleEllipsis, CircleX, Copy, MoreHorizontal } from "lucide-react";
import { useStore } from "@/utility/store/useStore";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import md5 from 'md5';
import Image from "next/image"
import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Select, SelectContent, SelectTrigger, SelectValue } from "../ui/select";
import { SelectItem } from "@radix-ui/react-select";

const FormSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string().email(),
  role: z.string(),
  status: z.string(),
  signUpDate: z.string(),
  lastLogin: z.string(),
})

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      const user = row.original

      const emailHash = md5(user.email.trim().toLowerCase())

      // const gravatarUrl = `https://www.gravatar.com/avatar/${emailHash}`
      return (
        <div className="flex gap-3">
          <h1 className="font-semibold">{user.name}</h1>
        </div>
      )
    }
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "role",
    header: "Role",
  },
  {
    accessorKey: "signUpDate",
    header: "Sign Up Date",
  },
  {
    accessorKey: "lastLogin",
    header: "Last Login",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const user = row.original
      return (
        <div className="flex justify-center">
          {
            user.status === "Active" ? (
              <CircleCheck className="text-green-500"/>
            ) : user.status === "Inactive" ? (
              <CircleX className="text-red-500" />
            ) : ( // Pending
              <CircleEllipsis className="text-yellow-500" />
            )
          }
        </div>
      )
    }
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
          id: row.original.id,
          name: row.original.name,
          email: row.original.email,
          role: row.original.role,
          status: row.original.status,
          signUpDate: row.original.signUpDate,
          lastLogin: row.original.lastLogin,
        }
      })
      const user = row.original
      const deleteUser = useStore(state => state.deleteUser)
      const updateUser = useStore(state => state.updateUser)

      function onSubmit(data: z.infer<typeof FormSchema>) {
        updateUser(user.id, data)
        console.log(data)
      }
 
      return (
        <Dialog>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DialogTrigger asChild>
                <DropdownMenuItem className="hover:cursor-pointer">
                  Edit user
                </DropdownMenuItem>
              </DialogTrigger>
              <DropdownMenuItem
                onClick={() =>
                  navigator.clipboard.writeText(user.id.toString())
                }
              >
                Copy user ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="bg-red-600 font-semibold hover:cursor-pointer"
                onClick={() => deleteUser(user.id)}
              >
                Delete user
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Edit User</DialogTitle>

            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-1">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="email">Email</FormLabel>
                      <Input {...field} type="email" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="name">Name</FormLabel>
                      <Input {...field} type="name" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="role">Role</FormLabel>
                      <Select value={field.value} onValueChange={val => field.onChange(val)} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue>{field.value || "Select a role"}</SelectValue>
                          </SelectTrigger>
                        </FormControl>
                          <SelectContent>
                            <SelectItem className="p-1" value="Admin">Admin</SelectItem>
                            <SelectItem className="p-1" value="User">User</SelectItem>
                            <SelectItem className="p-1" value="Manager">Manager</SelectItem>
                          </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
                <DialogFooter className="sm:justify-start">
                  <DialogClose asChild>
                    <Button type="submit" variant="secondary">
                      Submit
                    </Button>
                  </DialogClose>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>

        </Dialog>
      );
    },
  },
]