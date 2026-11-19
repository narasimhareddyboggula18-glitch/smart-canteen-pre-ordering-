/* CampusBite public configuration.
   Only the publishable key belongs here. Never put the sb_secret_ key in this file. */
window.CAMPUSBITE_CONFIG = {
  supabaseUrl: "https://yydlpwulcpuamowzpcbj.supabase.co",
  supabaseKey: "sb_publishable_nndc9wySaYeJOweah_Gr4A_HO555EU2",
  requireLogin: true,
  ordersTable: "orders",
  canteen: {
    lat: 12.9716,
    lng: 77.5946,
    zoom: 16,
    label: "Annapurna Canteen · Block C",
    note: "Demo campus pin · update the coordinates in assets/supabase-config.js",
  },
};
