import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import Spinner from "@/components/ui/spinner";
import axiosClient from "@/config/axios.config";
import { Property } from "@/types/property";
import { useState } from "react";

interface Props {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  productToDelete: Property | null;
}
export default function DeletePropertyModal({ isOpen, setIsOpen, productToDelete: propertyToDelete }: Props) {
  const [pending, setPending] = useState(false);
  // const handleDelete = async () => {
  //   if (!productToDelete) return;
  //   try {
  //     setPending(true);
  //     await axiosClient.delete(`/products/${productToDelete.id}`);
  //     toast({ description: "Product deleted successfully!" });
  //     fetchProducts();
  //   } catch (error: any) {
  //     toast({ description: error.message });
  //   } finally {
  //     setPending(false);
  //     setProductToDelete(null);
  //     setIsOpen(false);
  //   }
  // };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Deletion</DialogTitle>
        </DialogHeader>
        <p>
          Are you sure you want to delete <strong>{propertyToDelete?.title}</strong>? This action cannot be undone.
        </p>
        <DialogFooter>
          <Button variant="secondary" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button variant="destructive" className="w-24">
            {pending ? <Spinner /> : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
