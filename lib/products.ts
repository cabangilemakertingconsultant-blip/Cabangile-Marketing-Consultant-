import { supabase } from "./supabase";

export async function getProducts() {
  const { data } = await supabase.from("products").select("*");
  return data || [];
}

export async function getProduct(slug: string) {
  const { data } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .single();

  return data;
}