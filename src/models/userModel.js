const supabase = require("../utils/supabaseClient");

/**
 * Simple user model helpers that talk directly to Supabase (no RLS usage).
 * Assumes a `users` table with at least: id (uuid or int), email (unique), password_hash, name
 */

async function getUserByEmail(email) {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .maybeSingle();

  if (error) {
    throw error;
  }
  return data;
}

async function getUserById(id) {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw error;
  }
  return data;
}

async function createUser({ email, password_hash, name }) {
  const payload = { email, password_hash, name };
  const { data, error } = await supabase
    .from("users")
    .insert([payload])
    .select()
    .maybeSingle();

  if (error) {
    throw error;
  }
  return data;
}

module.exports = {
  getUserByEmail,
  getUserById,
  createUser,
};
