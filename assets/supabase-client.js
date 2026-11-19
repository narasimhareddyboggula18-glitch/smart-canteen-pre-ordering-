/**
 * CampusBite · Shared Supabase Browser Client & Database Service
 * Uses the safe client-side publishable key.
 */
(function () {
  const config = window.CAMPUSBITE_CONFIG || {};

  function initClient() {
    if (window.cbSupabase) return window.cbSupabase;
    if (
      config.supabaseUrl &&
      config.supabaseKey &&
      window.supabase &&
      typeof window.supabase.createClient === "function"
    ) {
      window.cbSupabase = window.supabase.createClient(
        config.supabaseUrl,
        config.supabaseKey,
        {
          auth: {
            persistSession: true,
            autoRefreshToken: true,
            detectSessionInUrl: true,
          },
        }
      );
      window.cbSupabaseConfigured = true;
    } else {
      window.cbSupabase = null;
      window.cbSupabaseConfigured = false;
    }
    return window.cbSupabase;
  }

  window.cbConfig = config;
  initClient();

  // Unified DB and Auth helper
  window.cbDb = {
    getClient() {
      return window.cbSupabase || initClient();
    },

    isConfigured() {
      return Boolean(this.getClient());
    },

    // ---------------- Authentication ----------------
    async signUp(email, password, name) {
      const client = this.getClient();
      if (!client) throw new Error("Supabase is not configured yet.");

      return await client.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            name: name ? name.trim() : "Campus Student",
          },
        },
      });
    },

    async signIn(email, password) {
      const client = this.getClient();
      if (!client) throw new Error("Supabase is not configured yet.");

      return await client.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
    },

    async signOut() {
      const client = this.getClient();
      if (!client) return { error: null };
      return await client.auth.signOut();
    },

    async getUser() {
      const client = this.getClient();
      if (!client) return null;
      try {
        const {
          data: { user },
        } = await client.auth.getUser();
        return user;
      } catch (e) {
        return null;
      }
    },

    async getSession() {
      const client = this.getClient();
      if (!client) return null;
      try {
        const {
          data: { session },
        } = await client.auth.getSession();
        return session;
      } catch (e) {
        return null;
      }
    },

    // ---------------- Profiles (User / Login) Table ----------------
    async getProfile(userId) {
      const client = this.getClient();
      if (!client) throw new Error("Supabase is not configured yet.");

      const { data, error } = await client
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .maybeSingle();

      if (error) throw error;
      return data;
    },

    async updateProfile(userId, updates) {
      const client = this.getClient();
      if (!client) throw new Error("Supabase is not configured yet.");

      const { data, error } = await client
        .from("profiles")
        .update(updates)
        .eq("id", userId)
        .select()
        .maybeSingle();

      if (error) throw error;
      return data;
    },

    // ---------------- Orders Table Queries ----------------
    async fetchOrders(userId) {
      const client = this.getClient();
      if (!client) throw new Error("Supabase is not configured yet.");

      let query = client
        .from(config.ordersTable || "orders")
        .select("*")
        .order("placed_at", { ascending: false });

      if (userId) {
        query = query.eq("user_id", userId);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    },

    async insertOrder(order, userId) {
      const client = this.getClient();
      if (!client) throw new Error("Supabase is not configured yet.");

      const payload = {
        user_id: userId,
        order_code: order.id,
        token: String(order.token),
        items: order.items || [],
        subtotal: Number(order.subtotal || 0),
        discount: Number(order.discount || 0),
        gst: Number(order.gst || 0),
        packaging: Number(order.packaging || 0),
        wallet_used: Number(order.walletUsed || 0),
        total: Number(order.total || 0),
        coupon: order.coupon || null,
        pickup_slot: order.slot || "",
        status: "placed",
        customer_name: order.customer ? order.customer.name : "",
        customer_phone: order.customer ? order.customer.phone : "",
      };

      const { data, error } = await client
        .from(config.ordersTable || "orders")
        .insert([payload])
        .select();

      if (error) throw error;
      return data && data[0] ? data[0] : payload;
    },

    async updateOrderStatus(orderCode, status) {
      const client = this.getClient();
      if (!client) throw new Error("Supabase is not configured yet.");

      const { data, error } = await client
        .from(config.ordersTable || "orders")
        .update({ status })
        .eq("order_code", orderCode)
        .select();

      if (error) throw error;
      return data;
    },
  };
})();
