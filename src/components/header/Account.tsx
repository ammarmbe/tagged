"use client";
import { User } from "lucia";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import * as Dialog from "@radix-ui/react-dialog";
import {
  LogOut,
  Mail,
  MapPinned,
  Menu,
  ReceiptTextIcon,
  Settings2,
  User2,
  X,
} from "lucide-react";
import { generalSans } from "@/utils";
import signout from "./signout";
import Image from "next/image";
import Link from "@/utils/Link";
import Cart from "./cart/Cart";

export default function AccountButton({ user }: { user: User }) {
  return (
    <Dialog.Root>
      <DropdownMenu.Root modal={false}>
        <div className="flex justify-end gap-1">
          <button
            className="button gray md"
            onClick={async () => {
              await fetch("/api/email");
            }}
          >
            Send email
          </button>
          <Cart />
          <Dialog.Portal>
            <Dialog.Content className="bg-background bg-primary fixed inset-y-0 right-0 z-50 h-full w-full transition duration-100 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 sm:max-w-lg">
              <div className="text-tertiary flex h-fit w-full items-center justify-between p-4 font-medium">
                <div className="flex items-center gap-8">
                  <div className="flex items-center gap-2">
                    <Image
                      src="/logo.svg"
                      height={24}
                      width={24}
                      alt="Atlas Logo"
                    />
                    <h1
                      className={`select-none text-xl font-semibold leading-[1.125] ${generalSans.className}`}
                    >
                      <Dialog.Close>
                        <Link href="/">Atlas</Link>
                      </Dialog.Close>
                    </h1>
                  </div>
                </div>
                <Dialog.Close className="button secondary !p-2">
                  <X />
                </Dialog.Close>
              </div>
              <div className="flex flex-col">
                <div className="text-secondary px-4 pb-4">
                  <p className="font-semibold">{user.name}</p>
                  <p>{user.email}</p>
                </div>
                <Link href="/orders">
                  <Dialog.Close className="mt-3 flex w-full items-center gap-2 px-4 py-2.5 hover:bg-gray-100">
                    <ReceiptTextIcon size={20} className="text-quaternary" />{" "}
                    Orders
                  </Dialog.Close>
                </Link>
                <Link href="/address">
                  <Dialog.Close className="flex w-full items-center gap-2 px-4 py-2.5 hover:bg-gray-100">
                    <MapPinned size={20} className="text-quaternary" /> Address
                  </Dialog.Close>
                </Link>
                <button>
                  <Dialog.Close className="flex w-full items-center gap-2 px-4 py-2.5 hover:bg-gray-100">
                    <Settings2 size={20} className="text-quaternary" /> Settings
                  </Dialog.Close>
                </button>
                <form action={signout}>
                  <Dialog.Close
                    type="submit"
                    className="mt-3 flex w-full items-center gap-2 px-4 py-2.5 hover:bg-gray-100"
                  >
                    <LogOut size={20} className="text-quaternary" /> Log out
                  </Dialog.Close>
                </form>
              </div>
            </Dialog.Content>
          </Dialog.Portal>
          <DropdownMenu.Portal>
            <DropdownMenu.Content
              style={{
                boxShadow:
                  "0 4px 6px -2px #10182808, 0 12px 16px -4px #10182814",
              }}
              className="bg-primary border-primary mt-2 overflow-hidden rounded-lg border data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
              align="end"
            >
              <div className="text-secondary px-4 py-3">
                <p className="font-semibold">{user.name}</p>
                <p>{user.email}</p>
              </div>
              <div className="border-primary mb-1 border-t" />
              <Link href="/orders">
                <DropdownMenu.Item className="text-secondary flex w-full items-center gap-2 p-2.5 hover:bg-gray-100">
                  <ReceiptTextIcon size={20} className="text-quaternary" />{" "}
                  Orders
                </DropdownMenu.Item>
              </Link>
              <Link href="/address">
                <DropdownMenu.Item className="text-secondary flex w-full items-center gap-2 p-2.5 hover:bg-gray-100">
                  <MapPinned size={20} className="text-quaternary" /> Address
                </DropdownMenu.Item>
              </Link>
              {!user.emailVerified ? (
                <Link href="/verify-email">
                  <DropdownMenu.Item className="text-secondary flex w-full items-center gap-2 p-2.5 hover:bg-gray-100">
                    <Mail size={20} className="text-quaternary" /> Verify Email
                  </DropdownMenu.Item>
                </Link>
              ) : null}
              <div className="border-primary my-1 border-t" />
              <form action={signout}>
                <DropdownMenu.Item>
                  <button
                    type="submit"
                    className="text-secondary flex w-full items-center gap-2 p-2.5 hover:bg-gray-100"
                  >
                    <LogOut size={20} className="text-quaternary" /> Log out
                  </button>
                </DropdownMenu.Item>
              </form>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
          <Dialog.Trigger className="button secondary !p-2 sm:hidden">
            <Menu />
          </Dialog.Trigger>
          <DropdownMenu.Trigger className="button secondary !hidden !p-2 sm:!inline-flex">
            <User2 size={20} />
          </DropdownMenu.Trigger>
        </div>
      </DropdownMenu.Root>
    </Dialog.Root>
  );
}
