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
  const [showEditModal, setShowEditModal]           = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [editForm, setEditForm] = useState({ name:"", description:"", address:"", phone:"", email:"", averagePrice:"" });
  const [editPhoto, setEditPhoto] = useState(null);
  const [editPreview, setEditPreview] = useState(null);

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

    // validar coordenadas
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
      await createRestaurant(payload, photoFile);

      setSuccess(`Restaurante "${form.name}" creado correctamente`);

      setForm(EMPTY_FORM);
      setPhotoFile(null);
      setPhotoPreview(null);
      setShowModal(false);
      setStep(1);

    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Error al crear restaurante"
      );
    }
  };
  // ── Handlers modal editar ──
  const openEdit = (r) => {
    setSelectedRestaurant(r);

    setEditForm({
      name: r.name || "",
      description: r.description || "",
      address: r.address || "",
      phone: r.phone || "",
      email: r.email || "",
      category: r.category || "",
      averagePrice: r.averagePrice || "",
      priceRange: r.priceRange || "$$",
      openingHours: r.openingHours || "08:00",
      closingHours: r.closingHours || "22:00"
    });

    setEditPreview(r.photo || null);
    setEditPhoto(null);

    setShowEditModal(true);
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

  const inp = "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:border-orange-400 bg-white";

  return (
    <div className="flex min-h-screen bg-gray-50">

      {/* ── SIDEBAR ── */}
      <aside className="w-52 min-w-52 bg-white border-r border-gray-100 p-4 flex-shrink-0">
        <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-2">Categoría</p>
        <button
          onClick={() => setCatFilter(null)}
          className={`flex items-center gap-2 w-full text-left px-2 py-1.5 rounded-lg text-sm mb-0.5 transition
            ${!catFilter ? "bg-orange-50 text-orange-600 font-medium" : "text-gray-500 hover:bg-gray-50"}`}>
          <span className="w-2 h-2 rounded-full flex-shrink-0 bg-gray-400" />
          Todas
        </button>
        {CAT_FILTERS.map(f => (
          <button key={f.key}
            onClick={() => setCatFilter(catFilter === f.key ? null : f.key)}
            className={`flex items-center gap-2 w-full text-left px-2 py-1.5 rounded-lg text-sm mb-0.5 transition
              ${catFilter === f.key ? "bg-orange-50 text-orange-600 font-medium" : "text-gray-500 hover:bg-gray-50"}`}>
            <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: f.color }} />
            {f.label}
          </button>
        ))}
      </aside>

      {/* ── MAIN ── */}
      <main className="flex-1 p-6">

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {[
            { n: counts.total,  l: "Total registrados" },
            { n: counts.active, l: "Activos" },
          ].map((s, i) => (
            <div key={i} className="bg-white border border-gray-100 rounded-xl px-5 py-4">
              <p className="text-2xl font-medium text-gray-800">{s.n}</p>
              <p className="text-xs text-gray-400 mt-1">{s.l}</p>
            </div>
          ))}
        </div>

        {/* Topbar */}
        <div className="flex gap-3 mb-5">
          <input
            className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-400 bg-white"
            placeholder="Buscar restaurante o dirección..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <button
            onClick={() => { setShowModal(true); setError(""); setStep(1); }}
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition whitespace-nowrap"
          >
            + Agregar restaurante
          </button>
        </div>

        {success && (
          <div className="mb-4 px-4 py-2.5 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">
            {success}
          </div>
        )}

        {/* Cards restaurantes */}
        <div className="flex flex-col gap-3">
          {filtered.map(r => (
            <div key={r._id} className="bg-white border border-gray-100 rounded-xl flex overflow-hidden hover:border-gray-200 transition">
              <div className="w-24 min-w-24 bg-gray-50 flex items-center justify-center text-3xl">
                {r.photo
                  ? <img src={r.photo} alt={r.name} className="w-full h-full object-cover" />
                  : "🍽️"}
              </div>
              <div className="flex-1 px-4 py-3 flex items-center gap-4 min-w-0">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-gray-800 truncate">{r.name}</p>
                  <p className="text-xs text-gray-400 mt-0.5 truncate">{r.address}</p>
                  <div className="flex gap-2 mt-2 flex-wrap">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-orange-50 text-orange-600 font-medium">{r.category}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-green-50 text-green-700 font-medium">{r.priceRange} · Q{r.averagePrice}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusBadge[r.status] || "bg-gray-100 text-gray-500"}`}>
                      {r.status}
                    </span>
                    {r.ownerUserId && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 font-medium">Con admin</span>
                    )}
                  </div>
                </div>
                <div className="flex flex-col gap-2 items-end flex-shrink-0">
                  <button onClick={() => openEdit(r)}
                    className="px-3 py-1 text-xs border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition">
                    Editar
                  </button>
                  <button onClick={() => handleDelete(r)}
                    className="px-3 py-1 text-xs border border-red-200 rounded-lg text-red-500 hover:bg-red-50 transition">
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="text-center py-16 text-gray-400 text-sm">
              No se encontraron restaurantes
            </div>
          )}
        </div>
      </main>

      {/* ── MODAL CREAR ── */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl w-full max-w-lg flex flex-col max-h-[90vh] overflow-hidden">

            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-800">Nuevo restaurante</p>
                <p className="text-xs text-gray-400 mt-0.5">Completa los 3 pasos</p>
              </div>
              <button onClick={() => setShowModal(false)}
                className="w-7 h-7 rounded-full border border-gray-200 text-gray-400 text-sm hover:bg-gray-50 flex items-center justify-center">
                ✕
              </button>
            </div>

            <div className="flex border-b border-gray-100">
              {["1 · Información", "2 · Ubicación", "3 · Detalles"].map((label, i) => (
                <div key={i} className={`flex-1 text-center py-2.5 text-xs font-medium border-b-2 transition
                  ${step === i+1 ? "border-orange-500 text-orange-500" : "border-transparent text-gray-400"}`}>
                  {label}
                </div>
              ))}
            </div>

            {error && (
              <div className="mx-6 mt-4 px-3 py-2 bg-red-50 border border-red-200 text-red-600 rounded-lg text-xs">
                {error}
              </div>
            )}

            <div className="overflow-y-auto flex-1 px-6 py-4 space-y-4">

              {/* Paso 1 — Información */}
              {step === 1 && (
                <>
                  <label className="block border-2 border-dashed border-gray-200 rounded-xl p-4 text-center cursor-pointer hover:border-orange-300 transition">
                    {photoPreview
                      ? <img src={photoPreview} className="w-full h-32 object-cover rounded-lg" alt="preview" />
                      : <div className="py-4 text-gray-400 text-sm">Arrastra una foto o haz clic para subir</div>}
                    <input type="file" accept="image/*" onChange={handlePhoto} className="hidden" />
                  </label>
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">Nombre</label>
                    <input name="name" value={form.name} onChange={handleChange} className={inp} placeholder="La Fonda Chapina" />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">Descripción</label>
                    <textarea name="description" value={form.description} onChange={handleChange}
                      className={inp + " resize-none h-16"} placeholder="Describe el restaurante..." />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-gray-500 mb-1 block">Categoría</label>
                      <select name="category" value={form.category} onChange={handleChange} className={inp}>
                        <option value="">— Selecciona —</option>
                        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 mb-1 block">Rango de precio</label>
                      <select name="priceRange" value={form.priceRange} onChange={handleChange} className={inp}>
                        {PRICE_RANGES.map(p => <option key={p} value={p}>{p}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 mb-1 block">Precio promedio (Q)</label>
                      <input name="averagePrice" type="number" value={form.averagePrice} onChange={handleChange} className={inp} placeholder="75" />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 mb-1 block">Horario</label>
                      <div className="flex gap-2">
                        <input name="openingHours" type="time" value={form.openingHours} onChange={handleChange} className={inp} />
                        <input name="closingHours" type="time" value={form.closingHours} onChange={handleChange} className={inp} />
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Paso 2 — Ubicación */}
              {step === 2 && (
                <>
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">Dirección completa</label>
                    <input name="address" value={form.address} onChange={handleChange} className={inp} placeholder="5a Avenida 10-20, Zona 1" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-gray-500 mb-1 block">Calle / No.</label>
                      <input name="street" value={form.addressDetails.street} onChange={handleAddress} className={inp} placeholder="5a Avenida 10-20" />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 mb-1 block">Zona</label>
                      <input name="zone" value={form.addressDetails.zone} onChange={handleAddress} className={inp} placeholder="Zona 1" />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 mb-1 block">Ciudad</label>
                      <input name="city" value={form.addressDetails.city} onChange={handleAddress} className={inp} />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 mb-1 block">Departamento</label>
                      <input name="department" value={form.addressDetails.department} onChange={handleAddress} className={inp} />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 mb-1 block">Longitud</label>
                      <input type="number" step="any" value={form.location.coordinates[0]} onChange={e => handleCoord(0, e.target.value)} className={inp} placeholder="-90.5069" />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 mb-1 block">Latitud</label>
                      <input type="number" step="any" value={form.location.coordinates[1]} onChange={e => handleCoord(1, e.target.value)} className={inp} placeholder="14.6407" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-gray-500 mb-1 block">Teléfono</label>
                      <input name="phone" value={form.phone} onChange={handleChange} className={inp} placeholder="22345678" />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 mb-1 block">Email</label>
                      <input name="email" type="email" value={form.email} onChange={handleChange} className={inp} placeholder="contacto@restaurante.com" />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">Sitio web (opcional)</label>
                    <input name="website" value={form.website} onChange={handleChange} className={inp} placeholder="https://..." />
                  </div>
                </>
              )}

              {/* Paso 3 — Detalles */}
              {step === 3 && (
                <>
                  <div>
                    <label className="text-xs text-gray-500 mb-2 block">Características</label>
                    <div className="grid grid-cols-2 gap-2">
                      {FEATURES.map(({ key, label }) => (
                        <label key={key} className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                          <input type="checkbox" name={key} checked={form.features[key]} onChange={handleFeature} className="accent-orange-500 w-4 h-4" />
                          {label}
                        </label>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 mb-2 block">Métodos de pago</label>
                    <div className="grid grid-cols-2 gap-2">
                      {PAYMENT_METHODS.map(m => (
                        <label key={m} className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                          <input type="checkbox" checked={form.paymentMethods.includes(m)} onChange={() => handlePayment(m)} className="accent-orange-500 w-4 h-4" />
                          {m}
                        </label>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
              <span className="text-xs text-gray-400">Paso {step} de 3</span>
              <div className="flex gap-2">
                {step > 1 && (
                  <button onClick={() => setStep(s => s - 1)}
                    className="px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-500 hover:bg-gray-50 transition">
                    Atrás
                  </button>
                )}
                {step < 3
                  ? <button onClick={() => setStep(s => s + 1)}
                      className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm font-medium transition">
                      Siguiente →
                    </button>
                  : <button onClick={handleSubmit} disabled={loading}
                      className="px-4 py-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white rounded-lg text-sm font-medium transition">
                      {loading ? "Creando..." : "Crear restaurante"}
                    </button>
                }
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL EDITAR ── */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden">

            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <p className="font-medium text-gray-800">Editar restaurante</p>
              <button
                onClick={() => setShowEditModal(false)}
                className="w-7 h-7 rounded-full border border-gray-200 text-gray-400 text-sm hover:bg-gray-50 flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <div className="px-6 py-4 space-y-3 max-h-[70vh] overflow-y-auto">

              <label className="block border-2 border-dashed border-gray-200 rounded-xl p-4 text-center cursor-pointer hover:border-orange-300 transition">
                {editPreview
                  ? <img src={editPreview} className="w-full h-32 object-cover rounded-lg" />
                  : <div className="py-4 text-gray-400 text-sm">Cambiar imagen</div>}
                <input type="file" accept="image/*" onChange={handleEditPhoto} className="hidden" />
              </label>

              <div>
                <label className="text-xs text-gray-500 mb-1 block">Nombre</label>
                <input
                  name="name"
                  value={editForm.name}
                  onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                  className={inp}
                />
              </div>

              <div>
                <label className="text-xs text-gray-500 mb-1 block">Descripción</label>
                <textarea
                  name="description"
                  value={editForm.description}
                  onChange={e => setEditForm({ ...editForm, description: e.target.value })}
                  className={inp + " resize-none h-16"}
                />
              </div>

              <div>
                <label className="text-xs text-gray-500 mb-1 block">Dirección</label>
                <input
                  name="address"
                  value={editForm.address}
                  onChange={e => setEditForm({ ...editForm, address: e.target.value })}
                  className={inp}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Teléfono</label>
                  <input
                    name="phone"
                    value={editForm.phone}
                    onChange={e => setEditForm({ ...editForm, phone: e.target.value })}
                    className={inp}
                  />
                </div>

                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Email</label>
                  <input
                    name="email"
                    value={editForm.email}
                    onChange={e => setEditForm({ ...editForm, email: e.target.value })}
                    className={inp}
                  />
                </div>

                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Categoría</label>
                  <select
                    value={editForm.category}
                    onChange={e => setEditForm({ ...editForm, category: e.target.value })}
                    className={inp}
                  >
                    {CATEGORIES.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Precio promedio</label>
                  <input
                    type="number"
                    value={editForm.averagePrice}
                    onChange={e => setEditForm({ ...editForm, averagePrice: e.target.value })}
                    className={inp}
                  />
                </div>

                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Apertura</label>
                  <input
                    type="time"
                    value={editForm.openingHours}
                    onChange={e => setEditForm({ ...editForm, openingHours: e.target.value })}
                    className={inp}
                  />
                </div>

                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Cierre</label>
                  <input
                    type="time"
                    value={editForm.closingHours}
                    onChange={e => setEditForm({ ...editForm, closingHours: e.target.value })}
                    className={inp}
                  />
                </div>
              </div>

            </div>

            <div className="px-6 py-4 border-t border-gray-100 flex justify-between">
              <button
                onClick={() => handleDelete(selectedRestaurant)}
                className="px-4 py-2 border border-red-200 text-red-500 rounded-lg text-sm hover:bg-red-50 transition"
              >
                Eliminar
              </button>

              <div className="flex gap-2">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 border border-gray-200 text-gray-500 rounded-lg text-sm hover:bg-gray-50 transition"
                >
                  Cancelar
                </button>

                <button
                  onClick={handleUpdate}
                  disabled={loading}
                  className="px-4 py-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white rounded-lg text-sm font-medium transition"
                >
                  Guardar cambios
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};