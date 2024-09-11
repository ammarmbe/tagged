import * as Dialog from "@radix-ui/react-dialog";

export default function DialogComponent({
  sheet = false,
  trigger,
  open,
  onOpenChange,
  children,
}: {
  sheet?: boolean;
  trigger: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: React.ReactNode;
}) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>
      <Dialog.Overlay className="fixed inset-0 z-50 bg-[hsla(209,84%,5%,0.19)] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
      {sheet ? (
        <Dialog.Content className="fixed inset-y-0 right-0 z-50 flex h-full max-h-screen w-full flex-col overflow-auto bg-bg-0 transition ease-in-out data-[state=closed]:duration-300 data-[state=open]:duration-500 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-md">
          {children}
        </Dialog.Content>
      ) : (
        <Dialog.Content className="!pointer-events-none fixed inset-0 z-50 flex max-h-screen items-center justify-center rounded-2xl shadow-[0px_16px_40px_-12px_#585C5F1A] transition ease-in-out data-[state=closed]:duration-300 data-[state=open]:duration-500 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:data-[state=closed]:duration-200 sm:data-[state=open]:duration-200 sm:data-[state=closed]:fade-out-0 sm:data-[state=open]:fade-in-0 sm:data-[state=closed]:zoom-out-95 sm:data-[state=open]:zoom-in-95 sm:data-[state=closed]:slide-out-to-right-0 sm:data-[state=closed]:slide-out-to-top-[2%] sm:data-[state=open]:slide-in-from-right-0 sm:data-[state=open]:slide-in-from-top-[2%]">
          <div className="pointer-events-auto absolute inset-0 flex flex-col bg-bg-0 sm:static sm:h-fit sm:min-w-[350px] sm:max-w-md sm:rounded-2xl">
            {children}
          </div>
        </Dialog.Content>
      )}
    </Dialog.Root>
  );
}
