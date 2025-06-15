
import * as React from "react";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle, CheckCircle2 } from "lucide-react";

// Form Container
interface StandardFormProps extends React.FormHTMLAttributes<HTMLFormElement> {
  variant?: "default" | "modal" | "inline";
}

const StandardForm = React.forwardRef<HTMLFormElement, StandardFormProps>(
  ({ className, variant = "default", ...props }, ref) => {
    const variantClasses = {
      default: "space-y-6 p-8 rounded-3xl bg-[rgba(25,60,101,0.7)] backdrop-blur-md border-2 border-[rgba(54,209,254,0.4)] shadow-[0_0_35px_rgba(54,209,254,0.25)]",
      modal: "space-y-5",
      inline: "space-y-4"
    };

    return (
      <form
        ref={ref}
        className={cn(variantClasses[variant], className)}
        {...props}
      />
    );
  }
);
StandardForm.displayName = "StandardForm";

// Form Group
interface StandardFormGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  required?: boolean;
  error?: string;
  success?: boolean;
}

const StandardFormGroup = React.forwardRef<HTMLDivElement, StandardFormGroupProps>(
  ({ className, children, required, error, success, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("space-y-2", className)}
      {...props}
    >
      {children}
      {error && (
        <div className="flex items-center gap-2 text-red-400 text-sm font-manrope">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}
      {success && !error && (
        <div className="flex items-center gap-2 text-green-400 text-sm font-manrope">
          <CheckCircle2 size={16} />
          <span>Looks good!</span>
        </div>
      )}
    </div>
  )
);
StandardFormGroup.displayName = "StandardFormGroup";

// Form Label
interface StandardFormLabelProps extends React.ComponentPropsWithoutRef<typeof Label> {
  required?: boolean;
}

const StandardFormLabel = React.forwardRef<
  React.ElementRef<typeof Label>,
  StandardFormLabelProps
>(({ className, required, children, ...props }, ref) => (
  <Label
    ref={ref}
    className={cn(
      "text-white font-medium font-manrope tracking-tight",
      className
    )}
    {...props}
  >
    {children}
    {required && <span className="text-[#36d1fe] ml-1">*</span>}
  </Label>
));
StandardFormLabel.displayName = "StandardFormLabel";

// Form Input
interface StandardFormInputProps extends React.ComponentPropsWithoutRef<typeof Input> {
  error?: boolean;
  success?: boolean;
}

const StandardFormInput = React.forwardRef<
  React.ElementRef<typeof Input>,
  StandardFormInputProps
>(({ className, error, success, ...props }, ref) => (
  <Input
    ref={ref}
    className={cn(
      "bg-[rgba(255,255,255,0.05)] border-2 border-[rgba(54,209,254,0.3)] text-white placeholder:text-[rgba(255,255,255,0.5)]",
      "focus-visible:border-[#36d1fe] focus-visible:ring-4 focus-visible:ring-[#36d1fe]/20",
      "transition-all duration-200 font-manrope",
      "hover:border-[rgba(54,209,254,0.5)]",
      error && "border-red-400 focus-visible:border-red-400 focus-visible:ring-red-400/20",
      success && "border-green-400 focus-visible:border-green-400 focus-visible:ring-green-400/20",
      className
    )}
    {...props}
  />
));
StandardFormInput.displayName = "StandardFormInput";

// Form Textarea
interface StandardFormTextareaProps extends React.ComponentPropsWithoutRef<typeof Textarea> {
  error?: boolean;
  success?: boolean;
}

const StandardFormTextarea = React.forwardRef<
  React.ElementRef<typeof Textarea>,
  StandardFormTextareaProps
>(({ className, error, success, ...props }, ref) => (
  <Textarea
    ref={ref}
    className={cn(
      "bg-[rgba(255,255,255,0.05)] border-2 border-[rgba(54,209,254,0.3)] text-white placeholder:text-[rgba(255,255,255,0.5)]",
      "focus-visible:border-[#36d1fe] focus-visible:ring-4 focus-visible:ring-[#36d1fe]/20",
      "transition-all duration-200 font-manrope min-h-[120px] resize-none",
      "hover:border-[rgba(54,209,254,0.5)]",
      error && "border-red-400 focus-visible:border-red-400 focus-visible:ring-red-400/20",
      success && "border-green-400 focus-visible:border-green-400 focus-visible:ring-green-400/20",
      className
    )}
    {...props}
  />
));
StandardFormTextarea.displayName = "StandardFormTextarea";

// Form Helper Text
const StandardFormHelperText = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-[#cce7fa] opacity-80 font-manrope", className)}
    {...props}
  />
));
StandardFormHelperText.displayName = "StandardFormHelperText";

export {
  StandardForm,
  StandardFormGroup,
  StandardFormLabel,
  StandardFormInput,
  StandardFormTextarea,
  StandardFormHelperText,
};
