import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      className="toaster group"
      // Bottom-right — asosiy mazmunni to'smaydi, ekran o'qishga xalaqit bermaydi
      position="bottom-right"
      offset={16}
      gap={8}
      duration={3800}
      visibleToasts={3}
      closeButton
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background-secondary group-[.toaster]:text-text-primary group-[.toaster]:border-border group-[.toaster]:shadow-premium group-[.toaster]:rounded-xl",
          description: "group-[.toast]:text-text-secondary",
          actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton: "group-[.toast]:bg-background-tertiary group-[.toast]:text-text-secondary",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
