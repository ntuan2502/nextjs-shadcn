import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Dispatch, SetStateAction, ReactNode } from "react";
import { TFunction } from "i18next";

interface Field {
  label: string;
  value?: ReactNode;
}

interface GenericModalProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  t: TFunction<"translation", undefined>;
  title: string;
  fields: Field[];
}

export default function GenericModal({
  open,
  setOpen,
  t,
  title,
  fields,
}: GenericModalProps) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription />
        </DialogHeader>

        <div className="space-y-2">
          {fields.map((field, index) => (
            <div key={index}>
              <strong className="pr-1">{field.label}:</strong>
              {field.value || "-"}
            </div>
          ))}
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">{t("ui.button.close")}</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
