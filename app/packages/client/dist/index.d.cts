import * as React$2 from "react";
import React$1, { ButtonHTMLAttributes, ComponentProps, Context, Dispatch, ForwardRefExoticComponent, MemoExoticComponent, ReactNode, RefAttributes, RefObject, SVGProps, SetStateAction } from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import * as Ariakit from "@ariakit/react";
import { JSX } from "react/jsx-runtime";
import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog";
import { ClassProp } from "class-variance-authority/types";
import { VariantProps } from "class-variance-authority";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import * as HoverCardPrimitive from "@radix-ui/react-hover-card";
import * as InputNumberPrimitive from "rc-input-number";
import { ValueType } from "@rc-component/mini-decimal";
import * as LabelPrimitive from "@radix-ui/react-label";
import * as SliderPrimitive from "@radix-ui/react-slider";
import * as SeparatorPrimitive from "@radix-ui/react-separator";
import * as SwitchPrimitives from "@radix-ui/react-switch";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { TextareaAutosizeProps } from "react-textarea-autosize";
import * as ProgressPrimitive from "@radix-ui/react-progress";
import { RenderProps } from "input-otp";
import { Group, Panel, Separator as Separator$1 } from "react-resizable-panels";
import * as SelectPrimitive from "@radix-ui/react-select";
import { LucideIcon } from "lucide-react";
import { TFile, TStartupConfig, TUser } from "librechat-data-provider";
import { ColumnDef, SortingState } from "@tanstack/react-table";
import { SpringConfig } from "@react-spring/web";
import { ControllerRenderProps, FieldPath, FieldValues } from "react-hook-form";
import { TOptions } from "i18next";
import { PrimitiveAtom, WritableAtom } from "jotai";
import { ClassValue } from "clsx";
import { RESET } from "jotai/utils";

//#region src/components/Accordion.d.ts
declare const Accordion: React$2.ForwardRefExoticComponent<(AccordionPrimitive.AccordionSingleProps | AccordionPrimitive.AccordionMultipleProps) & React$2.RefAttributes<HTMLDivElement>>;
declare const AccordionItem: React$2.ForwardRefExoticComponent<Omit<AccordionPrimitive.AccordionItemProps & React$2.RefAttributes<HTMLDivElement>, "ref"> & React$2.RefAttributes<HTMLDivElement>>;
declare const AccordionTrigger: React$2.ForwardRefExoticComponent<Omit<AccordionPrimitive.AccordionTriggerProps & React$2.RefAttributes<HTMLButtonElement>, "ref"> & React$2.RefAttributes<HTMLButtonElement>>;
declare const AccordionContent: React$2.ForwardRefExoticComponent<Omit<AccordionPrimitive.AccordionContentProps & React$2.RefAttributes<HTMLDivElement>, "ref"> & React$2.RefAttributes<HTMLDivElement>>;
//#endregion
//#region src/components/AnimatedTabs.d.ts
interface TabItem {
  id?: string;
  label: React.ReactNode;
  content: React.ReactNode;
  disabled?: boolean;
}
interface AnimatedTabsProps {
  tabs: TabItem[];
  className?: string;
  tabListClassName?: string;
  tabClassName?: string;
  tabPanelClassName?: string;
  tabListProps?: Ariakit.TabListProps;
  containerClassName?: string;
  defaultSelectedId?: string;
}
declare function AnimatedTabs({
  tabs,
  className,
  tabListClassName,
  tabClassName,
  tabPanelClassName,
  containerClassName,
  tabListProps,
  defaultSelectedId
}: AnimatedTabsProps): JSX.Element;
//#endregion
//#region src/components/AlertDialog.d.ts
declare const AlertDialog: React$2.FC<AlertDialogPrimitive.AlertDialogProps>;
declare const AlertDialogTrigger: React$2.ForwardRefExoticComponent<AlertDialogPrimitive.AlertDialogTriggerProps & React$2.RefAttributes<HTMLButtonElement>>;
declare const AlertDialogContent: React$2.ForwardRefExoticComponent<Omit<AlertDialogPrimitive.AlertDialogContentProps & React$2.RefAttributes<HTMLDivElement>, "ref"> & React$2.RefAttributes<HTMLDivElement>>;
declare const AlertDialogHeader: {
  ({
    className,
    ...props
  }: React$2.HTMLAttributes<HTMLDivElement>): JSX.Element;
  displayName: string;
};
declare const AlertDialogFooter: {
  ({
    className,
    ...props
  }: React$2.HTMLAttributes<HTMLDivElement>): JSX.Element;
  displayName: string;
};
declare const AlertDialogTitle: React$2.ForwardRefExoticComponent<Omit<AlertDialogPrimitive.AlertDialogTitleProps & React$2.RefAttributes<HTMLHeadingElement>, "ref"> & React$2.RefAttributes<HTMLHeadingElement>>;
declare const AlertDialogDescription: React$2.ForwardRefExoticComponent<Omit<AlertDialogPrimitive.AlertDialogDescriptionProps & React$2.RefAttributes<HTMLParagraphElement>, "ref"> & React$2.RefAttributes<HTMLParagraphElement>>;
declare const AlertDialogAction: React$2.ForwardRefExoticComponent<Omit<AlertDialogPrimitive.AlertDialogActionProps & React$2.RefAttributes<HTMLButtonElement>, "ref"> & React$2.RefAttributes<HTMLButtonElement>>;
declare const AlertDialogCancel: React$2.ForwardRefExoticComponent<Omit<AlertDialogPrimitive.AlertDialogCancelProps & React$2.RefAttributes<HTMLButtonElement>, "ref"> & React$2.RefAttributes<HTMLButtonElement>>;
//#endregion
//#region src/components/Breadcrumb.d.ts
declare const Breadcrumb: React$2.ForwardRefExoticComponent<Omit<React$2.DetailedHTMLProps<React$2.HTMLAttributes<HTMLElement>, HTMLElement>, "ref"> & {
  separator?: React$2.ReactNode;
} & React$2.RefAttributes<HTMLElement>>;
declare const BreadcrumbList: React$2.ForwardRefExoticComponent<Omit<React$2.DetailedHTMLProps<React$2.OlHTMLAttributes<HTMLOListElement>, HTMLOListElement>, "ref"> & React$2.RefAttributes<HTMLOListElement>>;
declare const BreadcrumbItem: React$2.ForwardRefExoticComponent<Omit<React$2.DetailedHTMLProps<React$2.LiHTMLAttributes<HTMLLIElement>, HTMLLIElement>, "ref"> & React$2.RefAttributes<HTMLLIElement>>;
declare const BreadcrumbLink: React$2.ForwardRefExoticComponent<Omit<React$2.DetailedHTMLProps<React$2.AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>, "ref"> & {
  asChild?: boolean;
} & React$2.RefAttributes<HTMLAnchorElement>>;
declare const BreadcrumbPage: React$2.ForwardRefExoticComponent<Omit<React$2.DetailedHTMLProps<React$2.HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>, "ref"> & React$2.RefAttributes<HTMLSpanElement>>;
declare const BreadcrumbSeparator: {
  ({
    children,
    className,
    ...props
  }: React$2.ComponentProps<"li">): JSX.Element;
  displayName: string;
};
declare const BreadcrumbEllipsis: {
  ({
    className,
    ...props
  }: React$2.ComponentProps<"span">): JSX.Element;
  displayName: string;
};
//#endregion
//#region src/components/Button.d.ts
declare const buttonVariants: (props?: ({
  variant?: "default" | "link" | "submit" | "outline" | "destructive" | "secondary" | "ghost" | null | undefined;
  size?: "default" | "icon" | "sm" | "lg" | null | undefined;
} & ClassProp) | undefined) => string;
interface ButtonProps extends React$2.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}
declare const Button: React$2.ForwardRefExoticComponent<ButtonProps & React$2.RefAttributes<HTMLButtonElement>>;
//#endregion
//#region src/components/Checkbox.d.ts
type BaseCheckboxProps = Omit<React$2.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>, "aria-label" | "aria-labelledby"> & {
  asChild?: boolean;
};
type CheckboxProps = (BaseCheckboxProps & {
  "aria-label": string;
  "aria-labelledby"?: never;
}) | (BaseCheckboxProps & {
  "aria-labelledby": string;
  "aria-label"?: never;
});
declare const Checkbox: React$2.ForwardRefExoticComponent<CheckboxProps & React$2.RefAttributes<HTMLButtonElement>>;
//#endregion
//#region src/components/Dialog.d.ts
declare const Dialog: React$2.FC<DialogPrimitive.DialogProps>;
declare const DialogTrigger: React$2.ForwardRefExoticComponent<DialogPrimitive.DialogTriggerProps & React$2.RefAttributes<HTMLButtonElement>>;
declare const DialogContent: React$2.ForwardRefExoticComponent<Omit<DialogPrimitive.DialogContentProps & React$2.RefAttributes<HTMLDivElement>, "ref"> & {
  showCloseButton?: boolean;
  disableScroll?: boolean;
} & React$2.RefAttributes<HTMLDivElement>>;
declare const DialogHeader: {
  ({
    className,
    ...props
  }: React$2.HTMLAttributes<HTMLDivElement>): JSX.Element;
  displayName: string;
};
declare const DialogFooter: {
  ({
    className,
    ...props
  }: React$2.HTMLAttributes<HTMLDivElement>): JSX.Element;
  displayName: string;
};
declare const DialogTitle: React$2.ForwardRefExoticComponent<Omit<DialogPrimitive.DialogTitleProps & React$2.RefAttributes<HTMLHeadingElement>, "ref"> & React$2.RefAttributes<HTMLHeadingElement>>;
declare const DialogDescription: React$2.ForwardRefExoticComponent<Omit<DialogPrimitive.DialogDescriptionProps & React$2.RefAttributes<HTMLParagraphElement>, "ref"> & React$2.RefAttributes<HTMLParagraphElement>>;
declare const DialogClose: React$2.ForwardRefExoticComponent<Omit<DialogPrimitive.DialogCloseProps & React$2.RefAttributes<HTMLButtonElement>, "ref"> & React$2.RefAttributes<HTMLButtonElement>>;
declare const DialogButton: React$2.ForwardRefExoticComponent<Omit<ButtonProps & React$2.RefAttributes<HTMLButtonElement>, "ref"> & React$2.RefAttributes<HTMLButtonElement>>;
//#endregion
//#region src/components/DropdownMenu.d.ts
declare function DropdownMenu({
  ...props
}: React$2.ComponentProps<typeof DropdownMenuPrimitive.Root>): JSX.Element;
declare function DropdownMenuPortal({
  ...props
}: React$2.ComponentProps<typeof DropdownMenuPrimitive.Portal>): JSX.Element;
declare function DropdownMenuTrigger({
  ...props
}: React$2.ComponentProps<typeof DropdownMenuPrimitive.Trigger>): JSX.Element;
declare function DropdownMenuContent({
  className,
  sideOffset,
  ...props
}: React$2.ComponentProps<typeof DropdownMenuPrimitive.Content>): JSX.Element;
declare function DropdownMenuGroup({
  ...props
}: React$2.ComponentProps<typeof DropdownMenuPrimitive.Group>): JSX.Element;
declare function DropdownMenuItem({
  className,
  inset,
  variant,
  ...props
}: React$2.ComponentProps<typeof DropdownMenuPrimitive.Item> & {
  inset?: boolean;
  variant?: "default" | "destructive";
}): JSX.Element;
declare function DropdownMenuCheckboxItem({
  className,
  children,
  checked,
  ...props
}: React$2.ComponentProps<typeof DropdownMenuPrimitive.CheckboxItem>): JSX.Element;
declare function DropdownMenuRadioGroup({
  ...props
}: React$2.ComponentProps<typeof DropdownMenuPrimitive.RadioGroup>): JSX.Element;
declare function DropdownMenuRadioItem({
  className,
  children,
  ...props
}: React$2.ComponentProps<typeof DropdownMenuPrimitive.RadioItem>): JSX.Element;
declare function DropdownMenuLabel({
  className,
  inset,
  ...props
}: React$2.ComponentProps<typeof DropdownMenuPrimitive.Label> & {
  inset?: boolean;
}): JSX.Element;
declare function DropdownMenuSeparator({
  className,
  ...props
}: React$2.ComponentProps<typeof DropdownMenuPrimitive.Separator>): JSX.Element;
declare function DropdownMenuShortcut({
  className,
  ...props
}: React$2.ComponentProps<"span">): JSX.Element;
declare function DropdownMenuSub({
  ...props
}: React$2.ComponentProps<typeof DropdownMenuPrimitive.Sub>): JSX.Element;
declare function DropdownMenuSubTrigger({
  className,
  inset,
  children,
  ...props
}: React$2.ComponentProps<typeof DropdownMenuPrimitive.SubTrigger> & {
  inset?: boolean;
}): JSX.Element;
declare function DropdownMenuSubContent({
  className,
  ...props
}: React$2.ComponentProps<typeof DropdownMenuPrimitive.SubContent>): JSX.Element;
//#endregion
//#region src/components/HoverCard.d.ts
declare const HoverCard: React$2.FC<HoverCardPrimitive.HoverCardProps>;
declare const HoverCardTrigger: React$2.ForwardRefExoticComponent<HoverCardPrimitive.HoverCardTriggerProps & React$2.RefAttributes<HTMLAnchorElement>>;
declare const HoverCardPortal: React$2.FC<HoverCardPrimitive.HoverCardPortalProps>;
declare const HoverCardContent: React$2.ForwardRefExoticComponent<Omit<HoverCardPrimitive.HoverCardContentProps & React$2.RefAttributes<HTMLDivElement>, "ref"> & {
  disabled?: boolean;
} & React$2.RefAttributes<HTMLDivElement>>;
//#endregion
//#region src/components/Input.d.ts
type InputProps = React$2.InputHTMLAttributes<HTMLInputElement>;
declare const Input: React$2.ForwardRefExoticComponent<InputProps & React$2.RefAttributes<HTMLInputElement>>;
//#endregion
//#region src/components/InputNumber.d.ts
declare const InputNumber: React$2.ForwardRefExoticComponent<InputNumberPrimitive.InputNumberProps<ValueType> & React$2.RefAttributes<HTMLInputElement>>;
//#endregion
//#region src/components/SecretInput.d.ts
interface SecretInputProps extends Omit<React$2.InputHTMLAttributes<HTMLInputElement>, "type"> {
  /** Show the built-in copy button */
  showCopy?: boolean;
  /** Custom copy control rendered inside the input, in place of the built-in one */
  copyButton?: React$2.ReactNode;
  /** Callback when value is copied */
  onCopy?: () => void;
  /** Duration in ms to show checkmark after copy (default: 2000) */
  copyFeedbackDuration?: number;
  label?: React$2.ReactNode;
  labelClassName?: string;
  containerClassName?: string;
  controlsClassName?: string;
  buttonClassName?: string;
  controlsOnHover?: boolean;
}
declare const SecretInput: React$2.ForwardRefExoticComponent<SecretInputProps & React$2.RefAttributes<HTMLInputElement>>;
//#endregion
//#region src/components/FilterInput.d.ts
interface FilterInputProps extends Omit<React$2.InputHTMLAttributes<HTMLInputElement>, "placeholder"> {
  /** The label text shown in the floating label */
  label: string;
  /** Unique identifier for the input - used to link label */
  inputId: string;
  /** Container className for custom styling */
  containerClassName?: string;
}
/**
* A standardized filter/search input component with a floating label
* that animates up when focused or has a value.
*
* @example
* <FilterInput
*   inputId="bookmarks-filter"
*   label={localize('com_ui_bookmarks_filter')}
*   value={searchQuery}
*   onChange={(e) => setSearchQuery(e.target.value)}
* />
*/
declare const FilterInput: React$2.ForwardRefExoticComponent<FilterInputProps & React$2.RefAttributes<HTMLInputElement>>;
//#endregion
//#region src/components/Label.d.ts
declare const Label: React$2.ForwardRefExoticComponent<Omit<LabelPrimitive.LabelProps & React$2.RefAttributes<HTMLLabelElement>, "ref"> & {
  className?: string;
} & React$2.RefAttributes<HTMLLabelElement>>;
//#endregion
//#region src/components/OriginalDialog.d.ts
interface OGDialogProps extends DialogPrimitive.DialogProps {
  triggerRef?: React$2.RefObject<HTMLButtonElement | HTMLInputElement | HTMLDivElement | null>;
  triggerRefs?: React$2.RefObject<HTMLButtonElement | HTMLInputElement | HTMLDivElement | null>[];
}
declare const Dialog$1: React$2.ForwardRefExoticComponent<OGDialogProps & React$2.RefAttributes<HTMLDivElement>>;
declare const DialogTrigger$1: React$2.ForwardRefExoticComponent<DialogPrimitive.DialogTriggerProps & React$2.RefAttributes<HTMLButtonElement>>;
declare const DialogPortal: React$2.FC<DialogPrimitive.DialogPortalProps>;
declare const DialogClose$1: React$2.ForwardRefExoticComponent<DialogPrimitive.DialogCloseProps & React$2.RefAttributes<HTMLButtonElement>>;
declare const DialogOverlay: React$2.ForwardRefExoticComponent<Omit<DialogPrimitive.DialogOverlayProps & React$2.RefAttributes<HTMLDivElement>, "ref"> & React$2.RefAttributes<HTMLDivElement>>;
declare const DialogContent$1: React$2.ForwardRefExoticComponent<Omit<DialogPrimitive.DialogContentProps & React$2.RefAttributes<HTMLDivElement>, "ref"> & {
  showCloseButton?: boolean;
  disableScroll?: boolean;
  overlayClassName?: string;
} & React$2.RefAttributes<HTMLDivElement>>;
declare const DialogHeader$1: {
  ({
    className,
    ...props
  }: React$2.HTMLAttributes<HTMLDivElement>): JSX.Element;
  displayName: string;
};
declare const DialogFooter$1: {
  ({
    className,
    ...props
  }: React$2.HTMLAttributes<HTMLDivElement>): JSX.Element;
  displayName: string;
};
declare const DialogTitle$1: React$2.ForwardRefExoticComponent<Omit<DialogPrimitive.DialogTitleProps & React$2.RefAttributes<HTMLHeadingElement>, "ref"> & React$2.RefAttributes<HTMLHeadingElement>>;
declare const DialogDescription$1: React$2.ForwardRefExoticComponent<Omit<DialogPrimitive.DialogDescriptionProps & React$2.RefAttributes<HTMLParagraphElement>, "ref"> & React$2.RefAttributes<HTMLParagraphElement>>;
//#endregion
//#region src/components/QuestionMark.d.ts
declare const QuestionMark: ({
  className
}: {
  className?: string | undefined;
}) => JSX.Element;
//#endregion
//#region src/components/Slider.d.ts
type SliderProps = React$2.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> & {
  className?: string;
  onDoubleClick?: () => void;
  "aria-describedby"?: string;
} & ({
  "aria-label": string;
  "aria-labelledby"?: never;
} | {
  "aria-labelledby": string;
  "aria-label"?: never;
} | {
  "aria-label": string;
  "aria-labelledby": string;
});
declare const Slider: React$2.ForwardRefExoticComponent<SliderProps & React$2.RefAttributes<HTMLSpanElement>>;
//#endregion
//#region src/components/Separator.d.ts
declare const Separator: React$2.ForwardRefExoticComponent<Omit<SeparatorPrimitive.SeparatorProps & React$2.RefAttributes<HTMLDivElement>, "ref"> & {
  className?: string;
} & React$2.RefAttributes<HTMLDivElement>>;
//#endregion
//#region src/common/enum.d.ts
declare enum ESide {
  Top = "top",
  Right = "right",
  Bottom = "bottom",
  Left = "left"
}
declare enum NotificationSeverity {
  INFO = "info",
  SUCCESS = "success",
  WARNING = "warning",
  ERROR = "error"
}
//#endregion
//#region src/common/types.d.ts
type TShowToast = {
  message: string;
  severity?: NotificationSeverity;
  showIcon?: boolean;
  duration?: number;
  status?: "error" | "success" | "warning" | "info";
};
type Option = Record<string, unknown> & {
  label?: string;
  value: string | number | null;
};
type OptionWithIcon = Option & {
  icon?: React.ReactNode;
};
type DropdownValueSetter = (value: string | Option | OptionWithIcon) => void;
type MentionOption = OptionWithIcon & {
  type: string;
  value: string;
  description?: string;
};
interface SelectedValues {
  endpoint: string | null;
  model: string | null;
  modelSpec: string | null;
}
//#endregion
//#region src/common/menus.d.ts
type RenderProp<P = React.HTMLAttributes<any> & {
  ref?: React.Ref<any>;
}> = (props: P) => React.ReactNode;
interface MenuItemProps {
  id?: string;
  label?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement | HTMLDivElement>) => void;
  icon?: React.ReactNode;
  kbd?: string;
  show?: boolean;
  disabled?: boolean;
  separate?: boolean;
  hideOnClick?: boolean;
  dialog?: React.ReactElement;
  ariaHasPopup?: boolean | "dialog" | "menu" | "true" | "false" | "listbox" | "tree" | "grid" | undefined;
  ariaControls?: string;
  ariaLabel?: string;
  ariaChecked?: boolean;
  ref?: React.Ref<any>;
  className?: string;
  render?: RenderProp<React.HTMLAttributes<any> & {
    ref?: React.Ref<any> | undefined;
  }> | React.ReactElement<any, string | React.JSXElementConstructor<any>> | undefined;
  subItems?: MenuItemProps[];
}
//#endregion
//#region src/components/InputCombobox.d.ts
type ComboboxProps = {
  label?: string;
  placeholder?: string;
  options: OptionWithIcon[] | string[];
  className?: string;
  labelClassName?: string;
  value: string;
  onChange: (value: string) => void;
  onBlur: () => void;
};
declare const InputCombobox: React$1.FC<ComboboxProps>;
//#endregion
//#region src/components/Skeleton.d.ts
declare function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>): JSX.Element;
//#endregion
//#region src/components/Switch.d.ts
type BaseSwitchProps = Omit<React$2.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>, "aria-label" | "aria-labelledby">;
type SwitchProps = (BaseSwitchProps & {
  "aria-label": string;
  "aria-labelledby"?: never;
}) | (BaseSwitchProps & {
  "aria-labelledby": string;
  "aria-label"?: never;
});
declare const Switch: React$2.ForwardRefExoticComponent<SwitchProps & React$2.RefAttributes<HTMLButtonElement>>;
//#endregion
//#region src/components/Table.d.ts
interface TableProps extends React$2.HTMLAttributes<HTMLTableElement> {
  unwrapped?: boolean;
}
declare const Table: React$2.ForwardRefExoticComponent<TableProps & React$2.RefAttributes<HTMLTableElement>>;
declare const TableHeader: React$2.ForwardRefExoticComponent<React$2.HTMLAttributes<HTMLTableSectionElement> & React$2.RefAttributes<HTMLTableSectionElement>>;
declare const TableBody: React$2.ForwardRefExoticComponent<React$2.HTMLAttributes<HTMLTableSectionElement> & React$2.RefAttributes<HTMLTableSectionElement>>;
declare const TableFooter: React$2.ForwardRefExoticComponent<React$2.HTMLAttributes<HTMLTableSectionElement> & React$2.RefAttributes<HTMLTableSectionElement>>;
declare const TableRow: React$2.ForwardRefExoticComponent<React$2.HTMLAttributes<HTMLTableRowElement> & React$2.RefAttributes<HTMLTableRowElement>>;
declare const TableHead: React$2.ForwardRefExoticComponent<React$2.ThHTMLAttributes<HTMLTableCellElement> & React$2.RefAttributes<HTMLTableCellElement>>;
declare const TableCell: React$2.ForwardRefExoticComponent<React$2.TdHTMLAttributes<HTMLTableCellElement> & React$2.RefAttributes<HTMLTableCellElement>>;
declare const TableRowHeader: React$2.ForwardRefExoticComponent<React$2.ThHTMLAttributes<HTMLTableCellElement> & React$2.RefAttributes<HTMLTableCellElement>>;
declare const TableCaption: React$2.ForwardRefExoticComponent<React$2.HTMLAttributes<HTMLTableCaptionElement> & React$2.RefAttributes<HTMLTableCaptionElement>>;
//#endregion
//#region src/components/Tabs.d.ts
declare const Tabs: React$2.ForwardRefExoticComponent<TabsPrimitive.TabsProps & React$2.RefAttributes<HTMLDivElement>>;
declare const TabsList: React$2.ForwardRefExoticComponent<Omit<TabsPrimitive.TabsListProps & React$2.RefAttributes<HTMLDivElement>, "ref"> & React$2.RefAttributes<HTMLDivElement>>;
declare const TabsTrigger: React$2.ForwardRefExoticComponent<Omit<TabsPrimitive.TabsTriggerProps & React$2.RefAttributes<HTMLButtonElement>, "ref"> & React$2.RefAttributes<HTMLButtonElement>>;
declare const TabsContent: React$2.ForwardRefExoticComponent<Omit<TabsPrimitive.TabsContentProps & React$2.RefAttributes<HTMLDivElement>, "ref"> & React$2.RefAttributes<HTMLDivElement>>;
//#endregion
//#region src/components/Tag.d.ts
declare const Tag: React$2.MemoExoticComponent<React$2.ForwardRefExoticComponent<Omit<React$2.DetailedHTMLProps<React$2.HTMLAttributes<HTMLDivElement>, HTMLDivElement>, "ref"> & {
  label: string;
  labelClassName?: string;
  CancelButton?: React$2.ReactNode;
  LabelNode?: React$2.ReactNode;
  onRemove?: (e: React$2.MouseEvent<HTMLButtonElement>) => void;
} & React$2.RefAttributes<HTMLDivElement>>>;
//#endregion
//#region src/components/Textarea.d.ts
interface TextareaProps extends React$2.TextareaHTMLAttributes<HTMLTextAreaElement> {}
declare const Textarea: React$2.ForwardRefExoticComponent<TextareaProps & React$2.RefAttributes<HTMLTextAreaElement>>;
//#endregion
//#region src/components/TextareaAutosize.d.ts
type BaseTextareaAutosizeProps = Omit<TextareaAutosizeProps, "aria-label" | "aria-labelledby">;
type TextareaAutosizePropsWithAria = (BaseTextareaAutosizeProps & {
  "aria-label": string;
  "aria-labelledby"?: never;
}) | (BaseTextareaAutosizeProps & {
  "aria-labelledby": string;
  "aria-label"?: never;
});
declare const TextareaAutosize: ForwardRefExoticComponent<TextareaAutosizePropsWithAria & RefAttributes<HTMLTextAreaElement>>;
//#endregion
//#region src/components/Toast.d.ts
declare function Toast(): JSX.Element;
//#endregion
//#region src/components/Tooltip.d.ts
interface TooltipAnchorProps extends Ariakit.TooltipAnchorProps {
  role?: string;
  className?: string;
  description: string;
  enableHTML?: boolean;
  side?: "top" | "bottom" | "left" | "right";
}
declare const TooltipAnchor: ForwardRefExoticComponent<Omit<TooltipAnchorProps, "ref"> & RefAttributes<HTMLDivElement>>;
//#endregion
//#region src/components/Pagination.d.ts
declare const Pagination: {
  ({
    className,
    ...props
  }: React$2.ComponentProps<"nav">): JSX.Element;
  displayName: string;
};
declare const PaginationContent: React$2.ForwardRefExoticComponent<Omit<React$2.DetailedHTMLProps<React$2.HTMLAttributes<HTMLUListElement>, HTMLUListElement>, "ref"> & React$2.RefAttributes<HTMLUListElement>>;
declare const PaginationItem: React$2.ForwardRefExoticComponent<Omit<React$2.DetailedHTMLProps<React$2.LiHTMLAttributes<HTMLLIElement>, HTMLLIElement>, "ref"> & React$2.RefAttributes<HTMLLIElement>>;
type PaginationLinkProps = {
  isActive?: boolean;
} & Pick<ButtonProps, "size"> & React$2.ComponentProps<"a">;
declare const PaginationLink: {
  ({
    className,
    isActive,
    size,
    children,
    ...props
  }: PaginationLinkProps): JSX.Element;
  displayName: string;
};
declare const PaginationPrevious: {
  ({
    className,
    ...props
  }: React$2.ComponentProps<typeof PaginationLink>): JSX.Element;
  displayName: string;
};
declare const PaginationNext: {
  ({
    className,
    ...props
  }: React$2.ComponentProps<typeof PaginationLink>): JSX.Element;
  displayName: string;
};
declare const PaginationEllipsis: {
  ({
    className,
    ...props
  }: React$2.ComponentProps<"span">): JSX.Element;
  displayName: string;
};
//#endregion
//#region src/components/Progress.d.ts
declare const Progress: React$2.ForwardRefExoticComponent<Omit<ProgressPrimitive.ProgressProps & React$2.RefAttributes<HTMLDivElement>, "ref"> & React$2.RefAttributes<HTMLDivElement>>;
//#endregion
//#region src/components/InputOTP.d.ts
declare const InputOTP: React$2.ForwardRefExoticComponent<(Omit<Omit<React$2.InputHTMLAttributes<HTMLInputElement>, "value" | "onChange" | "maxLength" | "containerClassName" | "textAlign" | "onComplete" | "pushPasswordManagerStrategy" | "pasteTransformer" | "noScriptCSSFallback"> & {
  value?: string;
  onChange?: (newValue: string) => unknown;
  maxLength: number;
  textAlign?: "left" | "center" | "right";
  onComplete?: (...args: unknown[]) => unknown;
  pushPasswordManagerStrategy?: "increase-width" | "none";
  pasteTransformer?: (pasted: string) => string;
  containerClassName?: string;
  noScriptCSSFallback?: string | null;
} & {
  render: (props: RenderProps) => React$2.ReactNode;
  children?: never;
} & React$2.RefAttributes<HTMLInputElement>, "ref"> | Omit<Omit<React$2.InputHTMLAttributes<HTMLInputElement>, "value" | "onChange" | "maxLength" | "containerClassName" | "textAlign" | "onComplete" | "pushPasswordManagerStrategy" | "pasteTransformer" | "noScriptCSSFallback"> & {
  value?: string;
  onChange?: (newValue: string) => unknown;
  maxLength: number;
  textAlign?: "left" | "center" | "right";
  onComplete?: (...args: unknown[]) => unknown;
  pushPasswordManagerStrategy?: "increase-width" | "none";
  pasteTransformer?: (pasted: string) => string;
  containerClassName?: string;
  noScriptCSSFallback?: string | null;
} & {
  render?: never;
  children: React$2.ReactNode;
} & React$2.RefAttributes<HTMLInputElement>, "ref">) & React$2.RefAttributes<HTMLInputElement>>;
declare const InputOTPGroup: React$2.ForwardRefExoticComponent<Omit<React$2.DetailedHTMLProps<React$2.HTMLAttributes<HTMLDivElement>, HTMLDivElement>, "ref"> & React$2.RefAttributes<HTMLDivElement>>;
declare const InputOTPSlot: React$2.ForwardRefExoticComponent<Omit<React$2.DetailedHTMLProps<React$2.HTMLAttributes<HTMLDivElement>, HTMLDivElement>, "ref"> & {
  index: number;
} & React$2.RefAttributes<HTMLDivElement>>;
declare const InputOTPSeparator: React$2.ForwardRefExoticComponent<Omit<React$2.DetailedHTMLProps<React$2.HTMLAttributes<HTMLDivElement>, HTMLDivElement>, "ref"> & React$2.RefAttributes<HTMLDivElement>>;
//#endregion
//#region src/components/MultiSearch.d.ts
/**
* Hook for conditionally making a multi-element list component into a sortable component
* Returns a RenderNode for search input when search functionality is available
* @param availableOptions
* @param placeholder
* @param getTextKeyOverride
* @param className - Additional classnames to add to the search container
* @param disabled - If the search should be disabled
* @returns
*/
declare function useMultiSearch<OptionsType extends unknown[]>({
  availableOptions,
  placeholder,
  getTextKeyOverride,
  className,
  disabled
}: {
  availableOptions?: OptionsType;
  placeholder?: string;
  getTextKeyOverride?: (node: OptionsType[0]) => string;
  className?: string;
  disabled?: boolean;
}): [OptionsType, React$1.ReactNode];
//#endregion
//#region src/components/Resizable.d.ts
declare const ResizablePanelGroup: ({
  className,
  ...props
}: ComponentProps<typeof Group>) => JSX.Element;
declare const ResizablePanel: typeof Panel;
declare const ResizableHandle: ({
  withHandle,
  className,
  ...props
}: ComponentProps<typeof Separator$1> & {
  withHandle?: boolean;
}) => JSX.Element;
declare const ResizableHandleAlt: ({
  withHandle,
  className,
  ...props
}: ComponentProps<typeof Separator$1> & {
  withHandle?: boolean;
}) => JSX.Element;
//#endregion
//#region src/components/Select.d.ts
declare const Select: React$2.FC<SelectPrimitive.SelectProps>;
declare const SelectGroup: React$2.ForwardRefExoticComponent<SelectPrimitive.SelectGroupProps & React$2.RefAttributes<HTMLDivElement>>;
declare const SelectValue: React$2.ForwardRefExoticComponent<SelectPrimitive.SelectValueProps & React$2.RefAttributes<HTMLSpanElement>>;
declare const SelectTrigger: React$2.ForwardRefExoticComponent<Omit<SelectPrimitive.SelectTriggerProps & React$2.RefAttributes<HTMLButtonElement>, "ref"> & React$2.RefAttributes<HTMLButtonElement>>;
declare const SelectScrollUpButton: React$2.ForwardRefExoticComponent<Omit<SelectPrimitive.SelectScrollUpButtonProps & React$2.RefAttributes<HTMLDivElement>, "ref"> & React$2.RefAttributes<HTMLDivElement>>;
declare const SelectScrollDownButton: React$2.ForwardRefExoticComponent<Omit<SelectPrimitive.SelectScrollDownButtonProps & React$2.RefAttributes<HTMLDivElement>, "ref"> & React$2.RefAttributes<HTMLDivElement>>;
declare const SelectContent: React$2.ForwardRefExoticComponent<Omit<SelectPrimitive.SelectContentProps & React$2.RefAttributes<HTMLDivElement>, "ref"> & React$2.RefAttributes<HTMLDivElement>>;
declare const SelectLabel: React$2.ForwardRefExoticComponent<Omit<SelectPrimitive.SelectLabelProps & React$2.RefAttributes<HTMLDivElement>, "ref"> & React$2.RefAttributes<HTMLDivElement>>;
declare const SelectItem: React$2.ForwardRefExoticComponent<Omit<SelectPrimitive.SelectItemProps & React$2.RefAttributes<HTMLDivElement>, "ref"> & React$2.RefAttributes<HTMLDivElement>>;
declare const SelectSeparator: React$2.ForwardRefExoticComponent<Omit<SelectPrimitive.SelectSeparatorProps & React$2.RefAttributes<HTMLDivElement>, "ref"> & React$2.RefAttributes<HTMLDivElement>>;
//#endregion
//#region src/components/Radio.d.ts
interface Option$1 {
  value: string;
  label: string;
  icon?: React$1.ReactNode;
}
interface RadioProps {
  options: Option$1[];
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  className?: string;
  buttonClassName?: string;
  fullWidth?: boolean;
  "aria-labelledby"?: string;
}
declare const Radio: React$1.NamedExoticComponent<RadioProps>;
//#endregion
//#region src/components/Badge.d.ts
interface BadgeProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onAnimationStart" | "onDragStart" | "onDragEnd" | "onDrag"> {
  icon?: LucideIcon;
  label: string;
  id?: string;
  isActive?: boolean;
  isEditing?: boolean;
  isDragging?: boolean;
  isAvailable: boolean;
  isInChat?: boolean;
  onBadgeAction?: () => void;
  onToggle?: () => void;
}
declare function Badge({
  icon: Icon,
  label,
  id,
  isActive,
  isEditing,
  isDragging,
  isAvailable,
  isInChat,
  onBadgeAction,
  onToggle,
  className,
  ...props
}: BadgeProps): JSX.Element;
//#endregion
//#region src/components/Avatar.d.ts
interface AvatarProps {
  user?: TUser;
  size?: number;
  className?: string;
  alt?: string;
  showDefaultWhenEmpty?: boolean;
}
declare const Avatar: React$1.FC<AvatarProps>;
//#endregion
//#region src/components/Combobox.d.ts
declare function ComboboxComponent({
  selectedValue,
  displayValue,
  items,
  setValue,
  ariaLabel,
  searchPlaceholder,
  selectPlaceholder,
  isCollapsed,
  SelectIcon
}: {
  ariaLabel: string;
  displayValue?: string;
  selectedValue: string;
  searchPlaceholder?: string;
  selectPlaceholder?: string;
  items: OptionWithIcon[] | string[];
  setValue: (value: string) => void;
  isCollapsed: boolean;
  SelectIcon?: React.ReactNode;
}): JSX.Element;
//#endregion
//#region src/components/Dropdown.d.ts
interface DropdownProps$1 {
  value?: string;
  label?: string;
  onChange: (value: string) => void;
  options: (string | Option | {
    divider: true;
  })[];
  className?: string;
  sizeClasses?: string;
  testId?: string;
  icon?: React$1.ReactNode;
  iconOnly?: boolean;
  renderValue?: (option: Option) => React$1.ReactNode;
  ariaLabel?: string;
  "aria-labelledby"?: string;
  portal?: boolean;
  disabled?: boolean;
  searchable?: boolean;
  searchPlaceholder?: string;
  searchEmptyText?: string;
}
declare const Dropdown: React$1.FC<DropdownProps$1>;
//#endregion
//#region src/components/DataTable.d.ts
type TableColumn<TData, TValue> = ColumnDef<TData, TValue> & {
  meta?: {
    size?: string | number;
    mobileSize?: string | number;
    minWidth?: string | number;
  };
};
interface DataTableProps<TData, TValue> {
  columns: TableColumn<TData, TValue>[];
  data: TData[];
  onDelete?: (selectedRows: TData[]) => Promise<void>;
  filterColumn?: string;
  defaultSort?: SortingState;
  columnVisibilityMap?: Record<string, string>;
  className?: string;
  pageSize?: number;
  isFetchingNextPage?: boolean;
  hasNextPage?: boolean;
  fetchNextPage?: (options?: unknown) => Promise<unknown>;
  enableRowSelection?: boolean;
  showCheckboxes?: boolean;
  onFilterChange?: (value: string) => void;
  filterValue?: string;
  isLoading?: boolean;
  enableSearch?: boolean;
}
declare function DataTable<TData, TValue>({
  columns,
  data,
  onDelete,
  filterColumn,
  defaultSort,
  className,
  isFetchingNextPage,
  hasNextPage,
  fetchNextPage,
  enableRowSelection,
  showCheckboxes,
  onFilterChange,
  filterValue,
  isLoading,
  enableSearch
}: DataTableProps<TData, TValue>): JSX.Element;
//#endregion
//#region src/components/SplitText.d.ts
interface SegmenterOptions {
  granularity?: "grapheme" | "word" | "sentence";
  localeMatcher?: "lookup" | "best fit";
}
interface SegmentData {
  segment: string;
  index: number;
  input: string;
  isWordLike?: boolean;
}
interface Segments {
  [Symbol.iterator](): IterableIterator<SegmentData>;
}
interface IntlSegmenter {
  segment(input: string): Segments;
}
interface IntlSegmenterConstructor {
  new (locales?: string | string[], options?: SegmenterOptions): IntlSegmenter;
}
declare global {
  interface Intl {
    Segmenter: IntlSegmenterConstructor;
  }
}
interface SplitTextProps {
  text?: string;
  className?: string;
  delay?: number;
  animationFrom?: {
    opacity: number;
    transform: string;
  };
  animationTo?: {
    opacity: number;
    transform: string;
  };
  easing?: SpringConfig["easing"];
  threshold?: number;
  rootMargin?: string;
  textAlign?: "left" | "right" | "center" | "justify" | "start" | "end";
  onLetterAnimationComplete?: () => void;
  onLineCountChange?: (lineCount: number) => void;
}
declare const SplitText: React.FC<SplitTextProps>;
//#endregion
//#region src/components/FormInput.d.ts
declare function FormInput<TFieldValues extends FieldValues = FieldValues, TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>>({
  field,
  label,
  labelClass,
  inputClass,
  containerClass,
  labelAdjacent,
  placeholder,
  type
}: {
  field: ControllerRenderProps<TFieldValues, TName>;
  label: string;
  labelClass?: string;
  inputClass?: string;
  placeholder?: string;
  containerClass?: string;
  type?: "string" | "number";
  labelAdjacent?: React$1.ReactNode;
}): JSX.Element;
//#endregion
//#region src/components/PixelCard.d.ts
declare const VARIANTS: {
  readonly default: {
    readonly gap: 5;
    readonly speed: 35;
    readonly colors: "#f8fafc,#f1f5f9,#cbd5e1";
    readonly noFocus: false;
  };
  readonly blue: {
    readonly gap: 10;
    readonly speed: 25;
    readonly colors: "#e0f2fe,#7dd3fc,#0ea5e9";
    readonly noFocus: false;
  };
  readonly yellow: {
    readonly gap: 3;
    readonly speed: 20;
    readonly colors: "#fef08a,#fde047,#eab308";
    readonly noFocus: false;
  };
  readonly pink: {
    readonly gap: 6;
    readonly speed: 80;
    readonly colors: "#fecdd3,#fda4af,#e11d48";
    readonly noFocus: true;
  };
};
interface PixelCardProps {
  variant?: keyof typeof VARIANTS;
  gap?: number;
  speed?: number;
  colors?: string;
  noFocus?: boolean;
  className?: string;
  progress?: number;
  randomness?: number;
  width?: string;
  height?: string;
}
declare function PixelCard({
  variant,
  gap,
  speed,
  colors,
  noFocus,
  className,
  progress,
  randomness,
  width,
  height
}: PixelCardProps): JSX.Element;
//#endregion
//#region src/components/FileUpload.d.ts
type FileUploadProps = {
  className?: string;
  onClick?: () => void;
  children: React$1.ReactNode;
  handleFileChange: (event: React$1.ChangeEvent<HTMLInputElement>) => void;
};
declare const FileUpload: React$1.ForwardRefExoticComponent<FileUploadProps & React$1.RefAttributes<HTMLInputElement>>;
//#endregion
//#region src/components/MultiSelect.d.ts
type MultiSelectItem<T extends string> = T | {
  label: string;
  value: T;
};
interface MultiSelectProps<T extends string> {
  items: MultiSelectItem<T>[];
  label?: string;
  placeholder?: string;
  onSelectedValuesChange?: (values: T[]) => void;
  renderSelectedValues?: (values: T[], placeholder?: string, items?: MultiSelectItem<T>[]) => React$1.ReactNode;
  className?: string;
  itemClassName?: string;
  labelClassName?: string;
  selectClassName?: string;
  selectIcon?: React$1.ReactNode;
  popoverClassName?: string;
  selectItemsClassName?: string;
  selectedValues: T[];
  setSelectedValues: (values: T[]) => void;
  renderItemContent?: (value: T, defaultContent: React$1.ReactNode, isSelected: boolean) => React$1.ReactNode;
}
declare function MultiSelect<T extends string>({
  items,
  label,
  placeholder,
  onSelectedValuesChange,
  renderSelectedValues,
  className,
  selectIcon,
  itemClassName,
  labelClassName,
  selectClassName,
  popoverClassName,
  selectItemsClassName,
  selectedValues,
  setSelectedValues,
  renderItemContent
}: MultiSelectProps<T>): JSX.Element;
//#endregion
//#region src/components/DropdownPopup.d.ts
interface DropdownProps {
  keyPrefix?: string;
  trigger: React$1.ReactNode;
  items: MenuItemProps[];
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  className?: string;
  iconClassName?: string;
  itemClassName?: string;
  sameWidth?: boolean;
  anchor?: {
    x: string;
    y: string;
  };
  gutter?: number;
  modal?: boolean;
  portal?: boolean;
  preserveTabOrder?: boolean;
  focusLoop?: boolean;
  menuId: string;
  mountByState?: boolean;
  unmountOnHide?: boolean;
  finalFocus?: React$1.RefObject<HTMLElement>;
}
declare const DropdownPopup: React$1.FC<DropdownProps>;
//#endregion
//#region src/components/DelayedRender.d.ts
interface DelayedRenderProps {
  delay: number;
  children: React$1.ReactNode;
}
declare const DelayedRender: ({
  delay,
  children
}: DelayedRenderProps) => React$1.ReactNode;
//#endregion
//#region src/components/ThemeSelector.d.ts
declare global {
  interface Window {
    lastThemeChange?: number;
  }
}
declare const ThemeSelector: ({
  returnThemeOnly
}: {
  returnThemeOnly?: boolean;
}) => JSX.Element;
//#endregion
//#region src/components/InfoHoverCard.d.ts
type InfoHoverCardProps = {
  side?: ESide;
  text: string;
};
declare const InfoHoverCard: ({
  side,
  text
}: InfoHoverCardProps) => JSX.Element;
//#endregion
//#region src/components/CheckboxButton.d.ts
declare const CheckboxButton: React$2.ForwardRefExoticComponent<{
  icon?: React$2.ReactNode;
  label: string;
  className?: string;
  checked?: boolean;
  defaultChecked?: boolean;
  isCheckedClassName?: string;
  setValue?: (values: {
    e?: React$2.ChangeEvent<HTMLInputElement>;
    value: boolean | string;
  }) => void;
} & React$2.RefAttributes<HTMLInputElement>>;
//#endregion
//#region src/components/DialogTemplate.d.ts
type SelectionProps$1 = {
  selectHandler?: () => void;
  selectClasses?: string;
  selectText?: string;
};
type DialogTemplateProps$1 = {
  title: string;
  description?: string;
  main?: ReactNode;
  buttons?: ReactNode;
  leftButtons?: ReactNode;
  selection?: SelectionProps$1;
  className?: string;
  headerClassName?: string;
  footerClassName?: string;
  showCloseButton?: boolean;
  showCancelButton?: boolean;
};
declare const DialogTemplate: ForwardRefExoticComponent<DialogTemplateProps$1 & RefAttributes<HTMLDivElement>>;
//#endregion
//#region src/components/SelectDropDown.d.ts
type SelectDropDownProps = {
  id?: string;
  title?: string;
  disabled?: boolean;
  value: string | null | Option | OptionWithIcon;
  setValue: DropdownValueSetter | ((value: string) => void);
  tabIndex?: number;
  availableValues?: string[] | Option[] | OptionWithIcon[];
  emptyTitle?: boolean;
  showAbove?: boolean;
  showLabel?: boolean;
  iconSide?: "left" | "right";
  optionIconSide?: "left" | "right";
  renderOption?: () => React$1.ReactNode;
  containerClassName?: string;
  currentValueClass?: string;
  optionsListClass?: string;
  optionsClass?: string;
  subContainerClassName?: string;
  className?: string;
  placeholder?: string;
  searchClassName?: string;
  searchPlaceholder?: string;
  showOptionIcon?: boolean;
};
declare function SelectDropDown({
  title: _title,
  value,
  disabled,
  setValue,
  availableValues,
  showAbove,
  showLabel,
  emptyTitle,
  iconSide,
  optionIconSide,
  placeholder,
  containerClassName,
  optionsListClass,
  optionsClass,
  currentValueClass,
  subContainerClassName,
  className,
  renderOption,
  searchClassName,
  searchPlaceholder,
  showOptionIcon
}: SelectDropDownProps): JSX.Element;
//#endregion
//#region src/components/ControlCombobox.d.ts
interface ControlComboboxProps {
  selectedValue: string;
  displayValue?: string;
  items: OptionWithIcon[];
  setValue: (value: string) => void;
  ariaLabel: string;
  searchPlaceholder?: string;
  selectPlaceholder?: string;
  isCollapsed: boolean;
  SelectIcon?: React.ReactNode;
  containerClassName?: string;
  iconClassName?: string;
  showCarat?: boolean;
  className?: string;
  disabled?: boolean;
  iconSide?: "left" | "right";
  selectId?: string;
  placement?: Ariakit.SelectStoreProps["placement"];
}
declare function ControlCombobox({
  selectedValue,
  displayValue,
  items,
  setValue,
  ariaLabel,
  searchPlaceholder,
  selectPlaceholder,
  containerClassName,
  isCollapsed,
  SelectIcon,
  showCarat,
  className,
  disabled,
  iconClassName,
  iconSide,
  selectId,
  placement
}: ControlComboboxProps): JSX.Element;
declare const ControlComboboxMemo: MemoExoticComponent<typeof ControlCombobox>;
//#endregion
//#region src/components/OGDialogTemplate.d.ts
type SelectionProps = {
  selectHandler?: () => void;
  selectClasses?: string;
  selectText?: string | ReactNode;
  isLoading?: boolean;
};
type DialogTemplateProps = {
  title: string;
  description?: string;
  main?: ReactNode;
  buttons?: ReactNode;
  leftButtons?: ReactNode;
  /**
  * Selection button configuration. Can be either:
  * - An object with selectHandler, selectClasses, selectText, isLoading (legacy)
  * - A ReactNode for custom selection component
  * @example
  * // Legacy usage
  * selection={{ selectHandler: () => {}, selectText: 'Confirm' }}
  * @example
  * // Custom component
  * selection={<Button onClick={handleConfirm}>Confirm</Button>}
  */
  selection?: SelectionProps | ReactNode;
  className?: string;
  overlayClassName?: string;
  headerClassName?: string;
  mainClassName?: string;
  footerClassName?: string;
  showCloseButton?: boolean;
  showCancelButton?: boolean;
  onClose?: () => void;
};
declare const OGDialogTemplate: ForwardRefExoticComponent<DialogTemplateProps & RefAttributes<HTMLDivElement>>;
//#endregion
//#region src/components/InputWithDropDown.d.ts
declare const InputWithDropdown: React$2.ForwardRefExoticComponent<React$2.InputHTMLAttributes<HTMLInputElement> & {
  options: string[];
  onSelect?: (value: string) => void;
} & React$2.RefAttributes<HTMLInputElement>>;
//#endregion
//#region src/components/AnimatedSearchInput.d.ts
declare const AnimatedSearchInput: ({
  value,
  onChange,
  isSearching: searching,
  placeholder
}: {
  value?: string;
  onChange: (e: React$1.ChangeEvent<HTMLInputElement>) => void;
  isSearching?: boolean;
  placeholder: string;
}) => JSX.Element;
//#endregion
//#region src/hooks/useLocalize.d.ts
type TranslationKeys = string;
/** Language lifecycle is managed by the host app — do not add i18n.changeLanguage() calls here. */
declare function useLocalize(): (phraseKey: TranslationKeys, options?: TOptions) => string;
//#endregion
//#region src/store.d.ts
declare const chatDirectionAtom: PrimitiveAtom<string> & {
  init: string;
};
declare const fontSizeAtom: PrimitiveAtom<string> & {
  init: string;
};
type ToastState = {
  open: boolean;
  message: string;
  severity: NotificationSeverity;
  showIcon: boolean;
};
declare const toastState: PrimitiveAtom<ToastState> & {
  init: ToastState;
};
//#endregion
//#region src/hooks/useToast.d.ts
declare function useToast(showDelay?: number): {
  toast: ToastState;
  onOpenChange: (open: boolean) => void;
  showToast: ({
    message,
    severity,
    showIcon,
    duration,
    status
  }: TShowToast) => void;
};
//#endregion
//#region src/hooks/useAvatar.d.ts
declare const useAvatar: (user: TUser | undefined) => string;
//#endregion
//#region src/hooks/useCombobox.d.ts
declare function useCombobox({
  value,
  options
}: {
  value: string;
  options: Array<OptionWithIcon | MentionOption>;
}): {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  searchValue: string;
  setSearchValue: Dispatch<SetStateAction<string>>;
  matches: (OptionWithIcon | MentionOption)[];
};
//#endregion
//#region src/hooks/useMediaQuery.d.ts
declare function useMediaQuery(query: string): boolean;
//#endregion
//#region src/hooks/useDelayedRender.d.ts
declare const useDelayedRender: (delay: number) => (fn: () => ReactNode) => ReactNode;
//#endregion
//#region src/hooks/useOnClickOutside.d.ts
type Handler = () => void;
declare function useOnClickOutside(ref: RefObject<HTMLElement>, handler: Handler, excludeIds: string[], customCondition?: (target: EventTarget | Element | null) => boolean): void;
//#endregion
//#region src/svgs/ArchiveIcon.d.ts
declare function ArchiveIcon({
  className
}: {
  className?: string | undefined;
}): JSX.Element;
//#endregion
//#region src/svgs/Blocks.d.ts
declare function Blocks({
  className
}: {
  className?: string;
}): JSX.Element;
//#endregion
//#region src/svgs/Plugin.d.ts
declare function Plugin({
  className,
  ...props
}: SVGProps<SVGSVGElement>): JSX.Element;
//#endregion
//#region src/svgs/GPTIcon.d.ts
declare function GPTIcon({
  size,
  className
}: {
  size?: number;
  className?: string;
}): JSX.Element;
//#endregion
//#region src/svgs/EditIcon.d.ts
type IconProps = {
  className?: string;
  size?: string;
};
declare const EditIcon: React$1.ForwardRefExoticComponent<IconProps & React$1.RefAttributes<SVGSVGElement>>;
//#endregion
//#region src/svgs/DataIcon.d.ts
declare function DataIcon({
  className
}: {
  className?: string;
}): JSX.Element;
//#endregion
//#region src/svgs/Sidebar.d.ts
declare function Sidebar({
  className
}: {
  className?: string;
}): JSX.Element;
//#endregion
//#region src/svgs/MobileSidebar.d.ts
declare function MobileSidebar({
  className
}: {
  className?: string;
}): JSX.Element;
//#endregion
//#region src/svgs/Spinner.d.ts
interface SpinnerProps {
  className?: string;
  size?: string | number;
  color?: string;
  bgOpacity?: number;
  speed?: number;
}
declare function Spinner({
  className,
  size,
  color,
  bgOpacity,
  speed
}: SpinnerProps): JSX.Element;
//#endregion
//#region src/svgs/Clipboard.d.ts
declare function Clipboard({
  className,
  size
}: {
  className?: string | undefined;
  size?: string | undefined;
}): JSX.Element;
//#endregion
//#region src/svgs/CheckMark.d.ts
declare function CheckMark({
  className
}: {
  className?: string;
}): JSX.Element;
//#endregion
//#region src/svgs/CrossIcon.d.ts
declare function CrossIcon({
  className
}: {
  className?: string | undefined;
}): JSX.Element;
//#endregion
//#region src/svgs/LogOutIcon.d.ts
declare function LogOutIcon(): JSX.Element;
//#endregion
//#region src/svgs/CustomMinimalIcon.d.ts
declare function CustomMinimalIcon({
  size,
  className
}: {
  size?: number;
  className?: string;
}): JSX.Element;
//#endregion
//#region src/svgs/LightningIcon.d.ts
declare function LightningIcon({
  className
}: {
  className?: string | undefined;
}): JSX.Element;
//#endregion
//#region src/svgs/AttachmentIcon.d.ts
declare function AttachmentIcon({
  className
}: {
  className?: string | undefined;
}): JSX.Element;
//#endregion
//#region src/svgs/MessagesSquared.d.ts
declare function MessagesSquared({
  className
}: {
  className?: string;
}): JSX.Element;
//#endregion
//#region src/svgs/StopGeneratingIcon.d.ts
declare function StopGeneratingIcon({
  className
}: {
  className?: string;
}): JSX.Element;
//#endregion
//#region src/svgs/RegenerateIcon.d.ts
declare function RegenerateIcon({
  className,
  size
}: {
  className?: string | undefined;
  size?: string | undefined;
}): JSX.Element;
//#endregion
//#region src/svgs/ContinueIcon.d.ts
declare function ContinueIcon({
  className
}: {
  className?: string;
}): JSX.Element;
//#endregion
//#region src/svgs/GoogleIcon.d.ts
declare function GoogleIcon(): JSX.Element;
//#endregion
//#region src/svgs/FacebookIcon.d.ts
declare function FacebookIcon(): JSX.Element;
//#endregion
//#region src/svgs/OpenIDIcon.d.ts
declare function OpenIDIcon(): JSX.Element;
//#endregion
//#region src/svgs/GithubIcon.d.ts
declare function GithubIcon(): JSX.Element;
//#endregion
//#region src/svgs/DiscordIcon.d.ts
declare function DiscordIcon(): JSX.Element;
//#endregion
//#region src/svgs/AppleIcon.d.ts
declare function AppleIcon(): JSX.Element;
//#endregion
//#region src/svgs/SamlIcon.d.ts
declare function SamlIcon(): JSX.Element;
//#endregion
//#region src/svgs/AnthropicIcon.d.ts
declare function AnthropicIcon({
  size,
  className
}: {
  size?: number;
  className?: string;
}): JSX.Element;
//#endregion
//#region src/svgs/SendIcon.d.ts
declare function SendIcon({
  size,
  className
}: {
  size?: number | undefined;
  className?: string | undefined;
}): JSX.Element;
//#endregion
//#region src/svgs/LinkIcon.d.ts
declare function LinkIcon(): JSX.Element;
//#endregion
//#region src/svgs/DotsIcon.d.ts
declare function DotsIcon({
  className
}: {
  className?: string;
}): JSX.Element;
//#endregion
//#region src/svgs/GearIcon.d.ts
interface GearIconProps {
  className?: string;
}
declare const GearIcon: React$1.FC<GearIconProps>;
//#endregion
//#region src/svgs/PinIcon.d.ts
declare function PinIcon({
  unpin
}: {
  unpin?: boolean;
}): JSX.Element;
//#endregion
//#region src/svgs/TrashIcon.d.ts
type TrashIconProps = {
  className?: string;
};
declare function TrashIcon({
  className
}: TrashIconProps): JSX.Element;
//#endregion
//#region src/svgs/MinimalPlugin.d.ts
declare function MinimalPlugin({
  size,
  className
}: {
  size?: number;
  className?: string;
}): JSX.Element;
//#endregion
//#region src/svgs/AzureMinimalIcon.d.ts
declare function AzureMinimalIcon({
  size,
  className
}: {
  size?: number;
  className?: string;
}): JSX.Element;
//#endregion
//#region src/svgs/OpenAIMinimalIcon.d.ts
declare function OpenAIMinimalIcon({
  className
}: {
  className?: string | undefined;
}): JSX.Element;
//#endregion
//#region src/svgs/ChatGPTMinimalIcon.d.ts
declare function ChatGPTMinimalIcon(): JSX.Element;
//#endregion
//#region src/svgs/PaLMinimalIcon.d.ts
declare function PaLMinimalIcon({
  className
}: {
  className?: string;
}): JSX.Element;
//#endregion
//#region src/svgs/PaLMIcon.d.ts
declare function PaLMIcon({
  size,
  className
}: {
  size?: number;
  className?: string;
}): JSX.Element;
//#endregion
//#region src/svgs/CodeyIcon.d.ts
declare function CodeyIcon({
  size,
  className
}: {
  size?: number;
  className?: string;
}): JSX.Element;
//#endregion
//#region src/svgs/GeminiIcon.d.ts
declare function GeminiIcon({
  size,
  className
}: {
  size?: number;
  className?: string;
}): JSX.Element;
//#endregion
//#region src/svgs/GoogleMinimalIcon.d.ts
declare function GoogleMinimalIcon({
  className
}: {
  className?: string;
}): JSX.Element;
//#endregion
//#region src/svgs/AnthropicMinimalIcon.d.ts
declare function AnthropicMinimalIcon(): JSX.Element;
//#endregion
//#region src/svgs/ListeningIcon.d.ts
type ListeningIconProps = {
  className?: string;
};
declare function ListeningIcon({
  className
}: ListeningIconProps): JSX.Element;
//#endregion
//#region src/svgs/VolumeIcon.d.ts
declare function VolumeIcon({
  className,
  size
}: {
  className?: string | undefined;
  size?: string | undefined;
}): JSX.Element;
//#endregion
//#region src/svgs/VolumeMuteIcon.d.ts
declare function VolumeMuteIcon({
  className,
  size
}: {
  className?: string | undefined;
  size?: string | undefined;
}): JSX.Element;
//#endregion
//#region src/svgs/SendMessageIcon.d.ts
declare function SendMessageIcon(): JSX.Element;
//#endregion
//#region src/svgs/UserIcon.d.ts
declare function UserIcon(): JSX.Element;
//#endregion
//#region src/svgs/LockIcon.d.ts
declare function LockIcon(): JSX.Element;
//#endregion
//#region src/svgs/NewChatIcon.d.ts
declare function NewChatIcon({
  className
}: {
  className?: string;
}): JSX.Element;
//#endregion
//#region src/svgs/ExperimentIcon.d.ts
declare function ExperimentIcon(): JSX.Element;
//#endregion
//#region src/svgs/GoogleIconChat.d.ts
declare function Google({
  className
}: {
  size?: number;
  className?: string;
}): JSX.Element;
//#endregion
//#region src/svgs/BirthdayIcon.d.ts
declare function BirthdayIcon({
  className
}: {
  className?: string | undefined;
}): JSX.Element;
//#endregion
//#region src/svgs/AssistantIcon.d.ts
declare function AssistantIcon({
  className,
  size
}: {
  className?: string;
  size?: string | number;
}): JSX.Element;
//#endregion
//#region src/svgs/Sparkles.d.ts
declare function Sparkles({
  className,
  size
}: {
  className?: string | undefined;
  size?: number | undefined;
}): JSX.Element;
//#endregion
//#region src/svgs/SpeechIcon.d.ts
type SpeechIconProps = {
  className?: string;
};
declare function SpeechIcon({
  className
}: SpeechIconProps): JSX.Element;
//#endregion
//#region src/svgs/SaveIcon.d.ts
type SaveIconProps = {
  size?: string | number;
  className?: string;
};
declare function SaveIcon({
  size,
  className
}: SaveIconProps): JSX.Element;
//#endregion
//#region src/svgs/CircleHelpIcon.d.ts
declare function CircleHelpIcon({
  className,
  size
}: {
  className?: string | undefined;
  size?: string | undefined;
}): JSX.Element;
//#endregion
//#region src/svgs/BedrockIcon.d.ts
declare function BedrockIcon({
  size,
  className
}: {
  size?: number;
  className?: string;
}): JSX.Element;
//#endregion
//#region src/svgs/ThumbUpIcon.d.ts
declare function ThumbUpIcon({
  className,
  size,
  bold
}: {
  className?: string | undefined;
  size?: string | undefined;
  bold?: boolean | undefined;
}): JSX.Element;
//#endregion
//#region src/svgs/ThumbDownIcon.d.ts
declare function ThumbDownIcon({
  className,
  size,
  bold
}: {
  className?: string | undefined;
  size?: string | undefined;
  bold?: boolean | undefined;
}): JSX.Element;
//#endregion
//#region src/svgs/XAIcon.d.ts
declare function XAIcon({
  className
}: {
  className?: string | undefined;
}): JSX.Element;
//#endregion
//#region src/svgs/PersonalizationIcon.d.ts
declare function PersonalizationIcon({
  className
}: {
  className?: string;
}): JSX.Element;
//#endregion
//#region src/svgs/MCPIcon.d.ts
declare function MCPIcon({
  className
}: {
  className?: string;
}): JSX.Element;
//#endregion
//#region src/svgs/VectorIcon.d.ts
declare function VectorIcon({
  className
}: {
  className?: string;
}): JSX.Element;
//#endregion
//#region src/svgs/SquirclePlusIcon.d.ts
declare function SquirclePlusIcon(): JSX.Element;
//#endregion
//#region src/svgs/AudioPaths.d.ts
declare function AudioPaths(): JSX.Element;
//#endregion
//#region src/svgs/CodePaths.d.ts
declare function CodePaths(): JSX.Element;
//#endregion
//#region src/svgs/FileIcon.d.ts
declare function FileIcon({
  file,
  fileType
}: {
  file?: Partial<TFile> & {
    progress?: number;
  };
  fileType: {
    fill: string;
    paths: React.FC;
    title: string;
  };
}): JSX.Element;
//#endregion
//#region src/svgs/FilePaths.d.ts
declare function FilePaths(): JSX.Element;
//#endregion
//#region src/svgs/SheetPaths.d.ts
declare function SheetPaths(): JSX.Element;
//#endregion
//#region src/svgs/TextPaths.d.ts
declare function TextPaths(): JSX.Element;
//#endregion
//#region src/svgs/VideoPaths.d.ts
declare function VideoPaths(): JSX.Element;
//#endregion
//#region src/svgs/SharePointIcon.d.ts
declare function SharePointIcon({
  className
}: {
  className?: string | undefined;
}): JSX.Element;
//#endregion
//#region src/svgs/MoonshotIcon.d.ts
declare function MoonshotIcon({
  className
}: {
  className?: string;
}): JSX.Element;
//#endregion
//#region src/utils/utils.d.ts
declare const cn: (...inputs: ClassValue[]) => string;
//#endregion
//#region src/utils/theme.d.ts
declare const applyFontSize: (val: string) => void;
declare const getInitialTheme: () => string;
//#endregion
//#region src/utils/cloudfront.d.ts
type CloudFrontCookieRefreshOptions = {
  getAuthorizationHeader?: () => string | undefined;
};
declare function configureCloudFrontCookieRefresh(startupConfig?: Pick<TStartupConfig, "cloudFront"> | null, options?: CloudFrontCookieRefreshOptions): void;
declare function isCloudFrontMediaUrl(url: string | null | undefined, startupConfig?: Pick<TStartupConfig, "cloudFront"> | null): boolean;
declare function withCloudFrontCacheBuster(url: string): string;
declare function refreshCloudFrontCookiesOnce(): Promise<boolean>;
declare function installCloudFrontImageRetry(startupConfig?: Pick<TStartupConfig, "cloudFront"> | null, options?: CloudFrontCookieRefreshOptions): () => void;
//#endregion
//#region src/utils/logger.d.ts
type LogFunction = (...args: unknown[]) => void;
declare const logger: {
  log: LogFunction;
  dir: LogFunction;
  warn: LogFunction;
  info: LogFunction;
  error: LogFunction;
  debug: LogFunction;
};
//#endregion
//#region src/Providers/ToastContext.d.ts
type ToastContextType = {
  showToast: ({
    message,
    severity,
    showIcon,
    duration
  }: TShowToast) => void;
};
declare const ToastContext: Context<ToastContextType>;
declare function useToastContext(): ToastContextType;
declare function ToastProvider({
  children
}: {
  children: ReactNode;
}): JSX.Element;
//#endregion
//#region src/theme/types/index.d.ts
/**
* Defines the color channels. Passed to the context from each app.
* RGB values should be in format "255 255 255" (space-separated)
*/
interface IThemeRGB {
  "rgb-text-primary"?: string;
  "rgb-text-secondary"?: string;
  "rgb-text-secondary-alt"?: string;
  "rgb-text-tertiary"?: string;
  "rgb-text-warning"?: string;
  "rgb-ring-primary"?: string;
  "rgb-header-primary"?: string;
  "rgb-header-hover"?: string;
  "rgb-header-button-hover"?: string;
  "rgb-surface-active"?: string;
  "rgb-surface-active-alt"?: string;
  "rgb-surface-hover"?: string;
  "rgb-surface-hover-alt"?: string;
  "rgb-surface-primary"?: string;
  "rgb-surface-primary-alt"?: string;
  "rgb-surface-primary-contrast"?: string;
  "rgb-surface-secondary"?: string;
  "rgb-surface-secondary-alt"?: string;
  "rgb-surface-tertiary"?: string;
  "rgb-surface-tertiary-alt"?: string;
  "rgb-surface-dialog"?: string;
  "rgb-surface-submit"?: string;
  "rgb-surface-submit-hover"?: string;
  "rgb-surface-destructive"?: string;
  "rgb-surface-destructive-hover"?: string;
  "rgb-surface-chat"?: string;
  "rgb-border-light"?: string;
  "rgb-border-medium"?: string;
  "rgb-border-medium-alt"?: string;
  "rgb-border-heavy"?: string;
  "rgb-border-xheavy"?: string;
  "rgb-brand-purple"?: string;
  "rgb-presentation"?: string;
  "rgb-background"?: string;
  "rgb-foreground"?: string;
  "rgb-primary"?: string;
  "rgb-primary-foreground"?: string;
  "rgb-secondary"?: string;
  "rgb-secondary-foreground"?: string;
  "rgb-muted"?: string;
  "rgb-muted-foreground"?: string;
  "rgb-accent"?: string;
  "rgb-accent-foreground"?: string;
  "rgb-destructive-foreground"?: string;
  "rgb-border"?: string;
  "rgb-input"?: string;
  "rgb-ring"?: string;
  "rgb-card"?: string;
  "rgb-card-foreground"?: string;
}
/**
* Name of the CSS variables used in tailwind.config
*/
interface IThemeVariables {
  "--text-primary": string;
  "--text-secondary": string;
  "--text-secondary-alt": string;
  "--text-tertiary": string;
  "--text-warning": string;
  "--ring-primary": string;
  "--header-primary": string;
  "--header-hover": string;
  "--header-button-hover": string;
  "--surface-active": string;
  "--surface-active-alt": string;
  "--surface-hover": string;
  "--surface-hover-alt": string;
  "--surface-primary": string;
  "--surface-primary-alt": string;
  "--surface-primary-contrast": string;
  "--surface-secondary": string;
  "--surface-secondary-alt": string;
  "--surface-tertiary": string;
  "--surface-tertiary-alt": string;
  "--surface-dialog": string;
  "--surface-submit": string;
  "--surface-submit-hover": string;
  "--surface-destructive": string;
  "--surface-destructive-hover": string;
  "--surface-chat": string;
  "--border-light": string;
  "--border-medium": string;
  "--border-medium-alt": string;
  "--border-heavy": string;
  "--border-xheavy": string;
  "--brand-purple": string;
  "--presentation": string;
  "--background": string;
  "--foreground": string;
  "--primary": string;
  "--primary-foreground": string;
  "--secondary": string;
  "--secondary-foreground": string;
  "--muted": string;
  "--muted-foreground": string;
  "--accent": string;
  "--accent-foreground": string;
  "--destructive-foreground": string;
  "--border": string;
  "--input": string;
  "--ring": string;
  "--card": string;
  "--card-foreground": string;
}
/**
* Name of the defined colors in the Tailwind theme
*/
interface IThemeColors {
  "text-primary"?: string;
  "text-secondary"?: string;
  "text-secondary-alt"?: string;
  "text-tertiary"?: string;
  "text-warning"?: string;
  "ring-primary"?: string;
  "header-primary"?: string;
  "header-hover"?: string;
  "header-button-hover"?: string;
  "surface-active"?: string;
  "surface-active-alt"?: string;
  "surface-hover"?: string;
  "surface-hover-alt"?: string;
  "surface-primary"?: string;
  "surface-primary-alt"?: string;
  "surface-primary-contrast"?: string;
  "surface-secondary"?: string;
  "surface-secondary-alt"?: string;
  "surface-tertiary"?: string;
  "surface-tertiary-alt"?: string;
  "surface-dialog"?: string;
  "surface-submit"?: string;
  "surface-submit-hover"?: string;
  "surface-destructive"?: string;
  "surface-destructive-hover"?: string;
  "surface-chat"?: string;
  "border-light"?: string;
  "border-medium"?: string;
  "border-medium-alt"?: string;
  "border-heavy"?: string;
  "border-xheavy"?: string;
  "brand-purple"?: string;
  presentation?: string;
  background?: string;
  foreground?: string;
  primary?: string;
  "primary-foreground"?: string;
  secondary?: string;
  "secondary-foreground"?: string;
  muted?: string;
  "muted-foreground"?: string;
  accent?: string;
  "accent-foreground"?: string;
  "destructive-foreground"?: string;
  border?: string;
  input?: string;
  ring?: string;
  card?: string;
  "card-foreground"?: string;
}
interface Theme {
  name: string;
  colors: IThemeRGB;
}
//#endregion
//#region src/theme/context/ThemeProvider.d.ts
type ThemeContextType = {
  theme: string;
  setTheme: (theme: string) => void;
  themeRGB?: IThemeRGB;
  setThemeRGB: (colors?: IThemeRGB) => void;
  themeName?: string;
  setThemeName: (name?: string) => void;
  resetTheme: () => void;
};
declare const ThemeContext: React$1.Context<ThemeContextType>;
interface ThemeProviderProps {
  children: React$1.ReactNode;
  themeRGB?: IThemeRGB;
  themeName?: string;
  initialTheme?: string;
}
/**
* Check if theme is dark
*/
declare const isDark: (theme: string) => boolean;
/**
* ThemeProvider component that handles both dark/light mode switching
* and dynamic color themes via CSS variables with localStorage persistence
*/
declare function ThemeProvider({
  children,
  themeRGB: propThemeRGB,
  themeName: propThemeName,
  initialTheme
}: ThemeProviderProps): JSX.Element;
/**
* Hook to access the current theme context
*/
declare function useTheme(): ThemeContextType;
//#endregion
//#region src/theme/utils/applyTheme.d.ts
/**
* Applies theme to the document root
* Sets CSS variables as rgb() values for compatibility with existing CSS
*/
declare function applyTheme(themeRGB?: IThemeRGB): void;
//#endregion
//#region src/theme/atoms/themeAtoms.d.ts
/**
* @deprecated Use ThemeContext instead. This atom is no longer used internally.
*/
declare const themeModeAtom: WritableAtom<string, [string | typeof RESET | ((prev: string) => string | typeof RESET)], void>;
/**
* @deprecated Use ThemeContext instead. This atom is no longer used internally.
*/
declare const themeColorsAtom: WritableAtom<IThemeRGB | undefined, [IThemeRGB | typeof RESET | ((prev: IThemeRGB | undefined) => IThemeRGB | typeof RESET | undefined) | undefined], void>;
/**
* @deprecated Use ThemeContext instead. This atom is no longer used internally.
*/
declare const themeNameAtom: WritableAtom<string | undefined, [string | typeof RESET | ((prev: string | undefined) => string | typeof RESET | undefined) | undefined], void>;
//#endregion
//#region src/theme/themes/default.d.ts
/**
* Default light theme
* RGB values extracted from the existing CSS variables
*/
declare const defaultTheme: IThemeRGB;
//#endregion
//#region src/theme/themes/dark.d.ts
/**
* Dark theme
* RGB values extracted from the existing dark mode CSS variables
*/
declare const darkTheme: IThemeRGB;
//#endregion
export { Accordion, AccordionContent, AccordionItem, AccordionTrigger, AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger, AnimatedSearchInput, AnimatedTabs, AnimatedTabsProps, AnthropicIcon, AnthropicMinimalIcon, AppleIcon, ArchiveIcon, AssistantIcon, AttachmentIcon, AudioPaths, Avatar, AzureMinimalIcon, Badge, BedrockIcon, BirthdayIcon, Blocks, Breadcrumb, BreadcrumbEllipsis, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator, Button, ButtonProps, ChatGPTMinimalIcon, CheckMark, Checkbox, CheckboxButton, CheckboxProps, CircleHelpIcon, Clipboard, CodePaths, CodeyIcon, ComboboxComponent as Combobox, ContinueIcon, ControlComboboxMemo as ControlCombobox, CrossIcon, CustomMinimalIcon, DataIcon, DataTable, DelayedRender, Dialog, DialogButton, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogOverlay, DialogOverlay as OGDialogOverlay, DialogTemplate, DialogTitle, DialogTrigger, DiscordIcon, DotsIcon, Dropdown, DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuPortal, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger, DropdownPopup, DropdownValueSetter, ESide, EditIcon, ExperimentIcon, FacebookIcon, FileIcon, FilePaths, FileUpload, FilterInput, FilterInputProps, FormInput, GPTIcon, GearIcon, GeminiIcon, GithubIcon, GoogleIcon, Google as GoogleIconChat, GoogleMinimalIcon, HoverCard, HoverCardContent, HoverCardPortal, HoverCardTrigger, IThemeColors, IThemeRGB, IThemeVariables, InfoHoverCard, Input, InputCombobox, InputNumber, InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot, InputProps, InputWithDropdown, Label, LightningIcon, LinkIcon, ListeningIcon, LockIcon, LogOutIcon, MCPIcon, MentionOption, type MenuItemProps, MessagesSquared, MinimalPlugin, MobileSidebar, MoonshotIcon, MultiSelect, NewChatIcon, NotificationSeverity, Dialog$1 as OGDialog, DialogClose$1 as OGDialogClose, DialogContent$1 as OGDialogContent, DialogDescription$1 as OGDialogDescription, DialogFooter$1 as OGDialogFooter, DialogHeader$1 as OGDialogHeader, DialogPortal as OGDialogPortal, OGDialogTemplate, DialogTitle$1 as OGDialogTitle, DialogTrigger$1 as OGDialogTrigger, OpenAIMinimalIcon, OpenIDIcon, Option, OptionWithIcon, PaLMIcon, PaLMinimalIcon, Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious, PersonalizationIcon, PinIcon, PixelCard, Plugin, Progress, QuestionMark, Radio, RegenerateIcon, ResizableHandle, ResizableHandleAlt, ResizablePanel, ResizablePanelGroup, SamlIcon, SaveIcon, SecretInput, SecretInputProps, Select, SelectContent, SelectDropDown, SelectGroup, SelectItem, SelectLabel, SelectScrollDownButton, SelectScrollUpButton, SelectSeparator, SelectTrigger, SelectValue, SelectedValues, SendIcon, SendMessageIcon, Separator, SharePointIcon, SheetPaths, Sidebar, Skeleton, Slider, Sparkles, SpeechIcon, Spinner, SplitText, SquirclePlusIcon, StopGeneratingIcon, Switch, TShowToast, TabItem, Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow, TableRowHeader, Tabs, TabsContent, TabsList, TabsTrigger, Tag, TextPaths, Textarea, TextareaAutosize, TextareaAutosizePropsWithAria, TextareaProps, Theme, ThemeContext, ThemeProvider, ThemeSelector, ThumbDownIcon, ThumbUpIcon, Toast, ToastContext, ToastProvider, ToastState, TooltipAnchor, type TranslationKeys, TrashIcon, UserIcon, VectorIcon, VideoPaths, VolumeIcon, VolumeMuteIcon, XAIcon, applyFontSize, applyTheme, buttonVariants, chatDirectionAtom, cn, configureCloudFrontCookieRefresh, darkTheme, defaultTheme, fontSizeAtom, getInitialTheme, installCloudFrontImageRetry, isCloudFrontMediaUrl, isDark, logger, refreshCloudFrontCookiesOnce, themeColorsAtom, themeModeAtom, themeNameAtom, toastState, useAvatar, useCombobox, useDelayedRender, useLocalize, useMediaQuery, useMultiSearch, useOnClickOutside, useTheme, useToast, useToastContext, withCloudFrontCacheBuster };
//# sourceMappingURL=index.d.cts.map