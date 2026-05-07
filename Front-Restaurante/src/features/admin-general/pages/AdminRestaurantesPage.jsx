import { useEffect, useState } from "react";
import { useRestaurantStore } from "../store/useRestaurantStore";

const CATEGORIES = ['GOURMET','CASUAL','CAFETERIA','FAST_FOOD','BAR','PIZZERIA','ITALIANA','MEXICANA','ASIATICA','MARISCOS','PARRILLADA','VEGETARIANA','POSTRES','OTRO'];
const PRICE_RANGES = ['$', '$$', '$$$', '$$$$'];
const PAYMENT_METHODS = ['EFECTIVO', 'TARJETA', 'TRANSFERENCIA', 'WALLET', 'CHEQUE'];

const EMPTY_FORM = {
  name: "", description: "", address: "",
  location: { type: "Point", coordinates: ["", ""] },
  addressDetails: { street: "", zone: "", city: "Guatemala", department: "Guatemala", country: "Guatemala" },
  phone: "", email: "", website: "", category: "", averagePrice: "", priceRange: "$$",
  openingHours: "08:00", closingHours: "22:00",
  features: { hasParking: false, hasWifi: false, hasDelivery: false, hasTakeout: true, acceptsReservations: true, allowsPets: false, hasOutdoorSeating: false, hasAirConditioning: false },
  paymentMethods: ["EFECTIVO", "TARJETA"],
};

const CAT_FILTERS = [
  { key: "GOURMET",    label: "Gourmet",    color: "#a78bfa" },
  { key: "CASUAL",     label: "Casual",     color: "#fb923c" },
  { key: "PARRILLADA", label: "Parrillada", color: "#f43f5e" },
  { key: "FAST_FOOD",  label: "Fast food",  color: "#38bdf8" },
  { key: "PIZZERIA",   label: "Pizzeria",   color: "#f59e0b" },
  { key: "ASIATICA",   label: "Asiática",   color: "#818cf8" },
];

const statusBadge = {
  ACTIVE:           "bg-green-50 text-green-700",
  INACTIVE:         "bg-gray-100 text-gray-500",
  SUSPENDED:        "bg-red-50 text-red-600",
  PENDING_APPROVAL: "bg-yellow-50 text-yellow-700",
};

const FEATURES = [
  { key: "hasParking",          label: "Parqueo" },
  { key: "hasWifi",             label: "WiFi" },
  { key: "hasDelivery",         label: "Delivery" },
  { key: "hasTakeout",          label: "Para llevar" },
  { key: "acceptsReservations", label: "Reservaciones" },
  { key: "allowsPets",          label: "Mascotas" },
  { key: "hasOutdoorSeating",   label: "Terraza" },
  { key: "hasAirConditioning",  label: "Aire acondicionado" },
];

export const RestaurantesPage = () => {
  const { restaurants, loading, getRestaurants, createRestaurant, updateRestaurant, deleteRestaurant } = useRestaurantStore();

  // ── Estado UI ──
  const [search, setSearch]         = useState("");
  const [catFilter, setCatFilter]   = useState(null);
  const [showModal, setShowModal]   = useState(false);
  const [step, setStep]             = useState(1);
  const [error, setError]           = useState("");
  const [success, setSuccess]       = useState("");

  // ── Estado formulario crear ──
  const [form, setForm]             = useState(EMPTY_FORM);
  const [photoFile, setPhotoFile]   = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);

  // ── Estado modal editar ──
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);

  useEffect(() => { getRestaurants(); }, []);

  // ── Handlers formulario crear ──
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleAddress = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, addressDetails: { ...prev.addressDetails, [name]: value } }));
  };

  const handleCoord = (i, v) => {
    const c = [...form.location.coordinates];
    c[i] = v;
    setForm(prev => ({ ...prev, location: { ...prev.location, coordinates: c } }));
  };

  const handleFeature = (e) => {
    const { name, checked } = e.target;
    setForm(prev => ({ ...prev, features: { ...prev.features, [name]: checked } }));
  };

  const handlePayment = (m) => {
    setForm(prev => ({
      ...prev,
      paymentMethods: prev.paymentMethods.includes(m)
        ? prev.paymentMethods.filter(x => x !== m)
        : [...prev.paymentMethods, m]
    }));
  };

  const handlePhoto = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async () => {
    setError("");

    if (
      !form.location.coordinates[0] ||
      !form.location.coordinates[1]
    ) {
      setError("Debes ingresar latitud y longitud");
      return;
    }

    const payload = {
      ...form,
      averagePrice: Number(form.averagePrice),
      location: {
        type: "Point",
        coordinates: [
          Number(form.location.coordinates[0]),
          Number(form.location.coordinates[1])
        ]
      }
    };

    try {
      if (selectedRestaurant) {
        await updateRestaurant(selectedRestaurant._id, payload, photoFile);
        setSuccess("Restaurante actualizado correctamente");
      } else {
        await createRestaurant(payload, photoFile);
        setSuccess(`Restaurante "${form.name}" creado correctamente`);
      }

      setForm(EMPTY_FORM);
      setPhotoFile(null);
      setPhotoPreview(null);
      setSelectedRestaurant(null);
      setShowModal(false);
      setStep(1);

    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Error al guardar restaurante"
      );
    }
  };
  // ── Handlers modal editar ──
  const openEdit = (r) => {
    setSelectedRestaurant(r);

    setForm({
      name: r.name || "",
      description: r.description || "",
      address: r.address || "",
      location: r.location || { type: "Point", coordinates: ["", ""] },
      addressDetails: r.addressDetails || EMPTY_FORM.addressDetails,
      phone: r.phone || "",
      email: r.email || "",
      website: r.website || "",
      category: r.category || "",
      averagePrice: r.averagePrice || "",
      priceRange: r.priceRange || "$$",
      openingHours: r.openingHours || "08:00",
      closingHours: r.closingHours || "22:00",
      features: r.features || EMPTY_FORM.features,
      paymentMethods: r.paymentMethods || ["EFECTIVO", "TARJETA"],
    });

    setPhotoPreview(r.photo || null);
    setPhotoFile(null);

    setShowModal(true);
    setStep(1);
  };

  const handleEditPhoto = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setEditPhoto(file);
    setEditPreview(URL.createObjectURL(file));
  };

  const handleUpdate = async () => {
    try {
      const payload = {
        ...editForm,
        averagePrice: Number(editForm.averagePrice)
      };

      await updateRestaurant(
        selectedRestaurant._id,
        payload,
        editPhoto
      );

      setSuccess("Restaurante actualizado");
      setShowEditModal(false);

    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Error al actualizar"
      );
    }
  };


  const handleDelete = async (r) => {
    if (!window.confirm(`¿Eliminar "${r.name}"?`)) return;
    try {
      await deleteRestaurant(r._id);
      setSuccess("Restaurante eliminado");
      setShowEditModal(false);
    } catch (err) {
      setError(err.response?.data?.error || "Error al eliminar");
    }
  };

  // ── Filtrado ──
  const filtered = restaurants.filter(r => {
    const matchSearch = r.name.toLowerCase().includes(search.toLowerCase()) || r.address.toLowerCase().includes(search.toLowerCase());
    const matchCat    = !catFilter || r.category === catFilter;
    return matchSearch && matchCat;
  });

  const counts = {
    total:  restaurants.length,
    active: restaurants.filter(r => r.status === "ACTIVE").length,
  };

  const inp =
    "w-full h-14 px-5 rounded-2xl border border-gray-200 bg-white text-sm text-gray-700 outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-orange-100";

  return (
    <div className="min-h-screen bg-[#f6f7fb] flex">

      {/* SIDEBAR */}
      <aside className="w-[260px] bg-white border-r border-gray-100 px-6 py-8 flex flex-col">

        <div>
          <p className="text-[18px] uppercase tracking-[0.2em] text-gray-400 font-semibold mb-4">
            Categorías
          </p>

          <div className="space-y-1">

            <button
              onClick={() => setCatFilter(null)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all text-sm font-medium
              ${
                !catFilter
                  ? "bg-gradient-to-r from-orange-500 to-orange-400 text-white shadow-lg shadow-orange-100"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <div className="w-2 h-2 rounded-full bg-current" />
              Todas
            </button>

            {CAT_FILTERS.map((f) => (
              <button
                key={f.key}
                onClick={() =>
                  setCatFilter(catFilter === f.key ? null : f.key)
                }
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all text-sm font-medium
                ${
                  catFilter === f.key
                    ? "bg-gradient-to-r from-orange-500 to-orange-400 text-white shadow-lg shadow-orange-100"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ background: f.color }}
                />

                {f.label}
              </button>
            ))}
          </div>
        </div>
      </aside>

      {/* MAIN */}
      <main className="flex-1 p-8 overflow-y-auto">

        {/* HEADER */}
        <div className="flex items-center justify-between mb-8">

          <div>
            <h2 className="text-3xl font-black text-gray-800 tracking-tight">
              Restaurantes
            </h2>

            <p className="text-gray-400 mt-1">
              Administra restaurantes, categorías y estados
            </p>
          </div>

          <button
            onClick={() => {
              setShowModal(true);
              setStep(1);
              setError("");
            }}
            className="h-12 px-6 rounded-2xl bg-gradient-to-r from-orange-500 to-orange-400 hover:scale-[1.02] transition-all text-white font-semibold shadow-lg shadow-orange-200"
          >
            + Nuevo restaurante
          </button>
        </div>

        {/* SUCCESS */}
        {success && (
          <div className="mb-6 px-5 py-4 rounded-2xl bg-green-50 border border-green-100 text-green-700 text-sm font-medium">
            {success}
          </div>
        )}

        {/* ERROR */}
        {error && (
          <div className="mb-6 px-5 py-4 rounded-2xl bg-red-50 border border-red-100 text-red-600 text-sm font-medium">
            {error}
          </div>
        )}

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 justify-center max-w-4xl mx-auto">

          <div className="bg-gradient-to-br from-white to-orange-50/40 rounded-3xl p-6 border border-orange-100 shadow-md hover:shadow-xl transition">
            <div className="flex items-start justify-between">

              <div>
                <p className="text-gray-400 text-sm">
                  Registrados
                </p>

                <h3 className="text-4xl font-black text-gray-800 mt-3">
                  {counts.total}
                </h3>
              </div>

              <div className="w-14 h-14 rounded-2xl bg-orange-100/70 backdrop-blur flex items-center justify-center text-2xl">
                🍽️
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-white to-green-50/40 rounded-3xl p-6 border border-green-100 shadow-md hover:shadow-xl transition">
            <div className="flex items-start justify-between">

              <div>
                <p className="text-gray-400 text-sm">
                  Activos
                </p>

                <h3 className="text-4xl font-black text-gray-800 mt-3">
                  {counts.active}
                </h3>
              </div>

              <div className="w-14 h-14 rounded-2xl bg-green-100/70 backdrop-blur flex items-center justify-center text-2xl">
                ✅
              </div>
            </div>
          </div>

        </div>

        {/* SEARCH */}
        <div className="bg-white border border-gray-100 rounded-3xl p-4 flex items-center gap-4 mb-8 shadow-sm">

          <div className="flex-1 relative">

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar restaurante..."
              className="w-full h-14 bg-gray-50 border border-gray-100 rounded-2xl px-5 text-sm outline-none focus:border-orange-400 focus:bg-white transition"
            />

            <div className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400">
              🔍
            </div>
          </div>
        </div>

        {/* LIST */}
        <div className="space-y-5">

          {filtered.map((r) => (
            <div
              key={r._id}
              className="group bg-white rounded-3xl border border-gray-100 hover:border-orange-200 transition-all overflow-hidden shadow-sm hover:shadow-xl"
            >
              <div className="flex h-[230px]">

                {/* IMAGE */}
                <div className="w-[260px] h-full bg-gray-100 overflow-hidden relative flex-shrink-0">

                  {r.photo ? (
                    <img
                      src={r.photo}
                      alt={r.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-6xl">
                      🍽️
                    </div>
                  )}

                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 rounded-full bg-white/90 backdrop-blur text-xs font-semibold text-gray-700 shadow">
                      {r.category}
                    </span>
                  </div>
                </div>

                {/* CONTENT */}
                <div className="flex-1 p-6 flex flex-col justify-between">

                  <div>

                    <div className="flex items-start justify-between gap-4">

                      <div>
                        <h3 className="text-2xl font-black text-gray-800">
                          {r.name}
                        </h3>

                        <p className="text-gray-400 mt-2 text-sm">
                          {r.address}
                        </p>
                      </div>

                      <span
                        className={`px-4 py-2 rounded-2xl text-xs font-bold
                        ${
                          statusBadge[r.status] ||
                          "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {r.status}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-3 mt-5">

                      <div className="px-4 py-2 rounded-2xl bg-orange-50 text-orange-600 text-sm font-semibold">
                        {r.priceRange} · Q{r.averagePrice}
                      </div>

                      {r.ownerUserId && (
                        <div className="px-4 py-2 rounded-2xl bg-blue-50 text-blue-600 text-sm font-semibold">
                          Admin asignado
                        </div>
                      )}

                      {r.features?.hasDelivery && (
                        <div className="px-4 py-2 rounded-2xl bg-green-50 text-green-600 text-sm font-semibold">
                          Delivery
                        </div>
                      )}

                      {r.features?.hasWifi && (
                        <div className="px-4 py-2 rounded-2xl bg-purple-50 text-purple-600 text-sm font-semibold">
                          WiFi
                        </div>
                      )}
                    </div>
                  </div>

                  {/* ACTIONS */}
                  <div className="flex items-center justify-between mt-6">

                    <div className="text-sm text-gray-500 font-medium">
                      📞 Tel: {r.phone || "Sin teléfono"}
                    </div>

                    <div className="flex gap-3">

                      <button
                        onClick={() => openEdit(r)}
                        className="h-11 px-5 rounded-2xl border border-gray-200 hover:bg-gray-50 text-sm font-semibold text-gray-700 transition"
                      >
                        Editar
                      </button>

                      <button
                        onClick={() => handleDelete(r)}
                        className="h-11 px-5 rounded-2xl bg-red-50 hover:bg-red-100 text-red-500 text-sm font-semibold transition"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="bg-white rounded-3xl border border-gray-100 py-20 text-center text-gray-400 shadow-sm">
              No se encontraron restaurantes
            </div>
          )}
        </div>
      </main>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">

          <div className="w-full max-w-6xl bg-white rounded-[32px] overflow-hidden shadow-2xl flex max-h-[94vh]">

            {/* SIDEBAR */}
            <div className="w-[320px] bg-gradient-to-b from-[#1a1a2e] to-[#16213e] p-8 text-white flex flex-col">
              <div>
                <h2 className="text-4xl font-black mt-4 leading-tight">
                  {selectedRestaurant ? "Editar Restaurante" : "Agregar Restaurante"}
                </h2>

                <p className="mt-4 text-gray-300 text-sm leading-relaxed">
                  Completa la información para registrar un nuevo restaurante.
                </p>
              </div>

              <div className="mt-12 space-y-4">

                {[1, 2, 3].map((s) => (
                  <div
                    key={s}
                    className={`rounded-2xl p-4 transition-all ${
                      step === s
                        ? "bg-orange-500 text-white shadow-lg shadow-orange-900/30"
                        : "bg-white/5 border border-white/10"
                    }`}
                  >
                    Paso {s}
                  </div>
                ))}
              </div>

              <div className="mt-auto">

                <div className="h-2 rounded-full bg-white/20 overflow-hidden">
                  <div
                    className="h-full bg-white transition-all"
                    style={{ width: `${(step / 3) * 100}%` }}
                  />
                </div>

                <p className="text-sm text-gray-300 mt-3">
                  Paso {step} de 3
                </p>
              </div>
            </div>

            {/* CONTENT */}
            <div className="flex-1 bg-[#fcfcfd] flex flex-col">

              {/* HEADER */}
              <div className="px-8 py-6 border-b border-gray-100 bg-white flex items-center justify-between">

                <div>
                  <h3 className="text-2xl font-black text-gray-800">
                    {
                      step === 1
                        ? "Información general"
                        : step === 2
                        ? "Ubicación"
                        : "Detalles"
                    }
                  </h3>
                </div>

                <button
                  onClick={() => setShowModal(false)}
                  className="w-11 h-11 rounded-2xl border border-gray-200 hover:bg-gray-50"
                >
                  ✕
                </button>
              </div>

              {/* BODY */}
              <div className="flex-1 overflow-y-auto px-8 py-8">

                {/* PASO 1 */}
                {step === 1 && (
                <div className="space-y-6">

                  {/* FOTO */}
                  <div className="flex justify-center">
                    <label className="block w-[460px] border-2 border-dashed border-gray-200 rounded-[24px] p-4 bg-white hover:border-orange-300 transition cursor-pointer">

                      {photoPreview ? (
                        <img
                          src={photoPreview}
                          className="w-full h-[260px] object-cover rounded-2xl"
                          alt="preview"
                        />
                      ) : (
                        <div className="h-[260px] flex flex-col items-center justify-center">

                          <div className="text-5xl">
                            📸
                          </div>

                          <p className="mt-3 font-bold text-base text-gray-700">
                            Subir fotografía
                          </p>

                          <p className="text-xs text-gray-400 mt-1">
                            PNG, JPG o WEBP
                          </p>
                        </div>
                      )}

                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhoto}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {/* FORM */}
                  <div className="grid grid-cols-2 gap-5">

                    <div className="col-span-2">
                      <label className="text-sm font-semibold text-gray-700 mb-2 block">
                        Nombre
                      </label>

                      <input
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        className={inp}
                        placeholder="La Fonda Chapina"
                      />
                    </div>

                    <div className="col-span-2">
                      <label className="text-sm font-semibold text-gray-700 mb-2 block">
                        Descripción
                      </label>

                      <textarea
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        className={`${inp} h-32 resize-none py-4`}
                        placeholder="Describe el restaurante..."
                      />
                    </div>

                    <div>
                      <label className="text-sm font-semibold text-gray-700 mb-2 block">
                        Categoría
                      </label>

                      <select
                        name="category"
                        value={form.category}
                        onChange={handleChange}
                        className={inp}
                      >
                        <option value="">Selecciona</option>

                        {CATEGORIES.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-sm font-semibold text-gray-700 mb-2 block">
                        Rango de precio
                      </label>

                      <select
                        name="priceRange"
                        value={form.priceRange}
                        onChange={handleChange}
                        className={inp}
                      >
                        {PRICE_RANGES.map((p) => (
                          <option key={p} value={p}>
                            {p}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-sm font-semibold text-gray-700 mb-2 block">
                        Precio promedio
                      </label>

                      <input
                        type="number"
                        name="averagePrice"
                        value={form.averagePrice}
                        onChange={handleChange}
                        className={inp}
                        placeholder="75"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-semibold text-gray-700 mb-2 block">
                        Horario
                      </label>

                      <div className="flex gap-3">

                        <input
                          type="time"
                          name="openingHours"
                          value={form.openingHours}
                          onChange={handleChange}
                          className={inp}
                        />

                        <input
                          type="time"
                          name="closingHours"
                          value={form.closingHours}
                          onChange={handleChange}
                          className={inp}
                        />
                      </div>
                    </div>

                  </div>
                </div>
              )}

                {/* PASO 2 */}
                {step === 2 && (
                  <div className="grid grid-cols-2 gap-5">

                    <div className="col-span-2">
                      <label className="text-sm font-semibold text-gray-700 mb-2 block">
                        Dirección completa
                      </label>

                      <input
                        name="address"
                        value={form.address}
                        onChange={handleChange}
                        className={inp}
                        placeholder="5a Avenida 10-20 Zona 1"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-semibold text-gray-700 mb-2 block">
                        Calle
                      </label>

                      <input
                        name="street"
                        value={form.addressDetails.street}
                        onChange={handleAddress}
                        className={inp}
                      />
                    </div>

                    <div>
                      <label className="text-sm font-semibold text-gray-700 mb-2 block">
                        Zona
                      </label>

                      <input
                        name="zone"
                        value={form.addressDetails.zone}
                        onChange={handleAddress}
                        className={inp}
                      />
                    </div>

                    <div>
                      <label className="text-sm font-semibold text-gray-700 mb-2 block">
                        Ciudad
                      </label>

                      <input
                        name="city"
                        value={form.addressDetails.city}
                        onChange={handleAddress}
                        className={inp}
                      />
                    </div>

                    <div>
                      <label className="text-sm font-semibold text-gray-700 mb-2 block">
                        Departamento
                      </label>

                      <input
                        name="department"
                        value={form.addressDetails.department}
                        onChange={handleAddress}
                        className={inp}
                      />
                    </div>

                    <div>
                      <label className="text-sm font-semibold text-gray-700 mb-2 block">
                        Longitud
                      </label>

                      <input
                        type="number"
                        step="any"
                        value={form.location.coordinates[0]}
                        onChange={(e) => handleCoord(0, e.target.value)}
                        className={inp}
                        placeholder="-90.5069"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-semibold text-gray-700 mb-2 block">
                        Latitud
                      </label>

                      <input
                        type="number"
                        step="any"
                        value={form.location.coordinates[1]}
                        onChange={(e) => handleCoord(1, e.target.value)}
                        className={inp}
                        placeholder="14.6407"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-semibold text-gray-700 mb-2 block">
                        Teléfono
                      </label>

                      <input
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        className={inp}
                      />
                    </div>

                    <div>
                      <label className="text-sm font-semibold text-gray-700 mb-2 block">
                        Email
                      </label>

                      <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        className={inp}
                      />
                    </div>

                    <div className="col-span-2">
                      <label className="text-sm font-semibold text-gray-700 mb-2 block">
                        Sitio web
                      </label>

                      <input
                        name="website"
                        value={form.website}
                        onChange={handleChange}
                        className={inp}
                        placeholder="https://..."
                      />
                    </div>
                  </div>
                )}

                {/* PASO 3 */}
                {step === 3 && (
                  <div className="space-y-8">

                    {/* FEATURES */}
                    <div>
                      <h4 className="text-xl font-black text-gray-800">
                        Características
                      </h4>

                      <div className="grid grid-cols-2 gap-4 mt-5">

                        {FEATURES.map(({ key, label }) => (
                          <label
                            key={key}
                            className={`rounded-2xl border p-5 cursor-pointer transition-all
                            ${
                              form.features[key]
                                ? "border-orange-300 bg-orange-50"
                                : "border-gray-200 bg-white hover:border-orange-200"
                            }`}
                          >
                            <div className="flex items-center justify-between">

                              <span className="font-semibold text-gray-700">
                                {label}
                              </span>

                              <input
                                type="checkbox"
                                name={key}
                                checked={form.features[key]}
                                onChange={handleFeature}
                                className="w-5 h-5 accent-orange-500"
                              />
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* PAYMENTS */}
                    <div>
                      <h4 className="text-xl font-black text-gray-800">
                        Métodos de pago
                      </h4>

                      <div className="grid grid-cols-2 gap-4 mt-5">

                        {PAYMENT_METHODS.map((m) => (
                          <label
                            key={m}
                            className={`rounded-2xl border p-5 cursor-pointer transition-all
                            ${
                              form.paymentMethods.includes(m)
                                ? "border-orange-300 bg-orange-50"
                                : "border-gray-200 bg-white hover:border-orange-200"
                            }`}
                          >
                            <div className="flex items-center justify-between">

                              <span className="font-semibold text-gray-700">
                                {m}
                              </span>

                              <input
                                type="checkbox"
                                checked={form.paymentMethods.includes(m)}
                                onChange={() => handlePayment(m)}
                                className="w-5 h-5 accent-orange-500"
                              />
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

              </div>

              {/* FOOTER */}
              <div className="px-8 py-6 border-t border-gray-100 bg-white flex items-center justify-between">

                <div>
                  {step > 1 && (
                    <button
                      onClick={() => setStep((s) => s - 1)}
                      className="h-12 px-6 rounded-2xl border border-gray-200"
                    >
                      Atrás
                    </button>
                  )}
                </div>

                <div className="flex gap-3">

                  <button
                    onClick={() => {
                      setShowModal(false);
                      setSelectedRestaurant(null);
                      setForm(EMPTY_FORM);
                    }}
                    className="h-12 px-6 rounded-2xl border border-gray-200"
                  >
                    Cancelar
                  </button>

                  {step < 3 ? (
                    <button
                      onClick={() => setStep((s) => s + 1)}
                      className="h-12 px-7 rounded-2xl bg-gradient-to-r from-orange-500 to-orange-400 text-white font-bold"
                    >
                      Continuar →
                    </button>
                  ) : (
                    <button
                      onClick={handleSubmit}
                      disabled={loading}
                      className="h-12 px-7 rounded-2xl bg-gradient-to-r from-orange-500 to-orange-400 text-white font-bold"
                    >
                      {loading
                        ? "Guardando..."
                        : selectedRestaurant
                          ? "Actualizar restaurante"
                          : "Crear restaurante"
                      }
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
