"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface Product {
  id: string;
  name: string;
  nameLt: string;
  description: string;
  price: number;
  priceType: "fixed" | "variable";
  icon: React.ReactNode;
  color: string;
  popular?: boolean;
}

const PRODUCTS: Product[] = [
  {
    id: "TYPE_1",
    name: "Automatic Valuation",
    nameLt: "Automatinis vertinimas",
    description: "Greitas automatinis nekilnojamojo turto vertinimas naudojant AI technologijas. Rezultatas per kelias minutes.",
    price: 8,
    priceType: "fixed",
    color: "bg-purple-500",
    popular: true,
    icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
  {
    id: "TYPE_2",
    name: "Valuator Assessment",
    nameLt: "Vertintojo nustatymas",
    description: "Profesionalaus vertintojo atliktas vertinimas su išsamia ataskaita. Tinka bankams ir notarams.",
    price: 30,
    priceType: "fixed",
    color: "bg-indigo-500",
    icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
  {
    id: "TYPE_3",
    name: "Price Adjustment",
    nameLt: "Kainos patikslinimas (Apžiūra)",
    description: "Vertintojo apsilankymas vietoje ir kainos patikslinimas pagal realią turto būklę.",
    price: 0,
    priceType: "variable",
    color: "bg-cyan-500",
    icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      </svg>
    ),
  },
  {
    id: "TYPE_4",
    name: "Bank Valuation",
    nameLt: "Turto vertinimas (Bankui)",
    description: "Pilnas turto vertinimas bankui su visais reikalingais dokumentais ir sertifikuota ataskaita.",
    price: 0,
    priceType: "variable",
    color: "bg-orange-500",
    icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
  },
];

export default function AdminProductsPage() {
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [editPrice, setEditPrice] = useState("");

  const handleEdit = (product: Product) => {
    setEditProduct(product);
    setEditPrice(product.price.toString());
  };

  const handleSave = () => {
    // Demo only - just show a toast
    toast.success(`Produktas "${editProduct?.nameLt}" atnaujintas (demo)`, {
      description: "Pakeitimai neišsaugoti - tai tik demonstracija.",
    });
    setEditProduct(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Produktai</h1>
          <p className="text-gray-600 mt-1">
            Valdykite paslaugas ir kainas
          </p>
        </div>
        <Badge variant="secondary" className="w-fit">
          <svg className="h-3 w-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Demo režimas
        </Badge>
      </div>

      {/* Info Banner */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="flex items-start gap-4 pt-6">
          <div className="flex-shrink-0">
            <svg className="h-6 w-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-blue-900">Demonstracinis puslapis</h3>
            <p className="text-sm text-blue-700 mt-1">
              Šis puslapis demonstruoja produktų valdymo funkcionalumą. Pakeitimai nėra išsaugomi.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Product Cards */}
      <div className="grid gap-6 md:grid-cols-2">
        {PRODUCTS.map((product) => (
          <Card key={product.id} className="relative overflow-hidden">
            {product.popular && (
              <div className="absolute top-4 right-4">
                <Badge className="bg-green-500 hover:bg-green-600">Populiarus</Badge>
              </div>
            )}
            <CardHeader>
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-lg ${product.color} text-white`}>
                  {product.icon}
                </div>
                <div className="flex-1">
                  <CardTitle className="text-lg">{product.nameLt}</CardTitle>
                  <CardDescription className="text-xs text-gray-400 mt-1">
                    {product.id}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600">{product.description}</p>

              <div className="flex items-center justify-between pt-4 border-t">
                <div>
                  <p className="text-sm text-gray-500">Kaina</p>
                  <p className="text-2xl font-bold">
                    {product.priceType === "fixed" ? (
                      <>{product.price} €</>
                    ) : (
                      <span className="text-base font-normal text-gray-500">Individuali</span>
                    )}
                  </p>
                </div>
                <Button variant="outline" onClick={() => handleEdit(product)}>
                  <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Redaguoti
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Dialog */}
      <Dialog open={!!editProduct} onOpenChange={() => setEditProduct(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Redaguoti produktą</DialogTitle>
            <DialogDescription>
              Pakeiskite produkto informaciją. (Demo - pakeitimai neišsaugomi)
            </DialogDescription>
          </DialogHeader>

          {editProduct && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Produkto pavadinimas</Label>
                <Input value={editProduct.nameLt} disabled className="bg-gray-50" />
              </div>

              <div className="space-y-2">
                <Label>Produkto ID</Label>
                <Input value={editProduct.id} disabled className="bg-gray-50" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">Kaina (€)</Label>
                {editProduct.priceType === "fixed" ? (
                  <Input
                    id="price"
                    type="number"
                    value={editPrice}
                    onChange={(e) => setEditPrice(e.target.value)}
                    min="0"
                  />
                ) : (
                  <Input value="Individuali kaina" disabled className="bg-gray-50" />
                )}
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditProduct(null)}>
              Atšaukti
            </Button>
            <Button onClick={handleSave}>
              Išsaugoti (Demo)
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
