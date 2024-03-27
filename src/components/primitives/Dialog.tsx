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
      <Dialog.Overlay className="fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
      {sheet ? (
        <Dialog.Content className="fixed flex flex-col z-50 bg-white transition ease-in-out data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:duration-300 data-[state=open]:duration-500 inset-y-0 right-0 h-full w-3/4 data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-sm">
          {children}
        </Dialog.Content>
      ) : (
        <Dialog.Content className="fixed inset-0 z-50 flex items-center justify-center transition ease-in-out rounded-2xl shadow-[0px_16px_32px_-12px_#585C5F1A] duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-top-[2%] data-[state=open]:slide-in-from-top-[2%] !pointer-events-none">
          <div className="bg-white rounded-2xl max-w-2xl min-w-[350px] sm:max-w-md h-fit pointer-events-auto">
            {children}
          </div>
        </Dialog.Content>
      )}
    </Dialog.Root>
  );
}
