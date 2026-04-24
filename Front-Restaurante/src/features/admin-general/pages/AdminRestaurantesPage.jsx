import { useEffect, useState } from "react"
import {
  getRestaurantsRequest,
  createRestaurantRequest,
  updateRestaurantRequest,
  deleteRestaurantRequest
} from "../../../shared/api/restaurants"

const CATEGORIES = ['GOURMET','CASUAL','CAFETERIA','FAST_FOOD','BAR','PIZZERIA','ITALIANA','MEXICANA','ASIATICA','MARISCOS','PARRILLADA','VEGETARIANA','POSTRES','OTRO']
const PRICE_RANGES = ['$', '$$', '$$$', '$$$$']
const PAYMENT_METHODS = ['EFECTIVO', 'TARJETA', 'TRANSFERENCIA', 'WALLET', 'CHEQUE']

const EMPTY_FORM = {
  name: "",
  description: "",
  address: "",
  location: { type: "Point", coordinates: ["", ""] },
  addressDetails: { street: "", zone: "", city: "Guatemala", department: "Guatemala", country: "Guatemala" },
  phone: "",
  email: "",
  category: "",
  averagePrice: "",
  priceRange: "$$",
  openingHours: "",
  closingHours: "",
  features: {
    hasParking: false,
    hasWifi: false,
    hasDelivery: false,
    hasTakeout: true,
    acceptsReservations: true,
  },
  paymentMethods: ["EFECTIVO", "TARJETA"],
}

export const RestaurantesPage = () => {
  const [restaurants, setRestaurants]   = useState([])
  const [search, setSearch]             = useState("")
  const [showForm, setShowForm]         = useState(false)
  const [form, setForm]                 = useState(EMPTY_FORM)
  const [loading, setLoading]           = useState(false)
  const [error, setError]               = useState("")
  const [success, setSuccess]           = useState("")

  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedRestaurant, setSelectedRestaurant] = useState(null)

  const [editForm, setEditForm] = useState({
    name: "",
    description: "",
    address: "",
    phone: "",
    email: "",
    averagePrice: ""
  })

  const getRestaurants = async () => {
    try {
      const { data } = await getRestaurantsRequest()
      setRestaurants(data.data)
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => { getRestaurants() }, [])

  // Handlers de campos simples
  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  // addressDetails
  const handleAddressDetail = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, addressDetails: { ...prev.addressDetails, [name]: value } }))
  }

  // coordenadas
  const handleCoord = (index, value) => {
    const coords = [...form.location.coordinates]
    coords[index] = value
    setForm(prev => ({ ...prev, location: { ...prev.location, coordinates: coords } }))
  }

  // features (checkboxes)
  const handleFeature = (e) => {
    const { name, checked } = e.target
    setForm(prev => ({ ...prev, features: { ...prev.features, [name]: checked } }))
  }

  // paymentMethods (checkboxes múltiples)
  const handlePayment = (method) => {
    setForm(prev => {
      const already = prev.paymentMethods.includes(method)
      return {
        ...prev,
        paymentMethods: already
          ? prev.paymentMethods.filter(m => m !== method)
          : [...prev.paymentMethods, method]
      }
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setLoading(true)

    try {
      // Convertir coordenadas a número antes de enviar
      const payload = {
        ...form,
        averagePrice: parseFloat(form.averagePrice),
        location: {
          type: "Point",
          coordinates: [
            parseFloat(form.location.coordinates[0]),
            parseFloat(form.location.coordinates[1])
          ]
        }
      }

      await createRestaurantRequest(payload)
      setSuccess(`Restaurante "${form.name}" creado correctamente`)
      setForm(EMPTY_FORM)
      setShowForm(false)
      await getRestaurants()
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.error || "Error al crear el restaurante")
    } finally {
      setLoading(false)
    }
  }

  const openEditModal = (restaurant) => {
  setSelectedRestaurant(restaurant)

  setEditForm({
    name: restaurant.name || "",
    description: restaurant.description || "",
    address: restaurant.address || "",
    phone: restaurant.phone || "",
    email: restaurant.email || "",
    averagePrice: restaurant.averagePrice || ""
  })

  setShowEditModal(true)
}

const handleEditChange = (e) => {
  setEditForm({
    ...editForm,
    [e.target.name]: e.target.value
  })
}

const handleUpdateRestaurant = async () => {
  try {
    await updateRestaurantRequest(
      selectedRestaurant._id,
      editForm
    )

    setSuccess("Restaurante actualizado correctamente")
    setShowEditModal(false)
    await getRestaurants()

  } catch (err) {
    setError(
      err.response?.data?.error ||
      "Error al actualizar restaurante"
    )
  }
}

const handleDeleteRestaurant = async () => {
    const confirmDelete = window.confirm(
      "¿Seguro que deseas eliminar este restaurante?"
    )

    if (!confirmDelete) return

    try {
      await deleteRestaurantRequest(selectedRestaurant._id)

      setSuccess("Restaurante eliminado correctamente")
      setShowEditModal(false)
      await getRestaurants()

    } catch (err) {
      setError(
        err.response?.data?.error ||
        "Error al eliminar restaurante"
      )
    }
  }

  const filteredRestaurants = restaurants.filter(r =>
    r.name.toLowerCase().includes(search.toLowerCase()) ||
    r.address.toLowerCase().includes(search.toLowerCase())
  )

  const statusColors = {
    ACTIVE:           "bg-green-100 text-green-700",
    INACTIVE:         "bg-gray-100 text-gray-500",
    SUSPENDED:        "bg-red-100 text-red-600",
    PENDING_APPROVAL: "bg-yellow-100 text-yellow-700",
  }

  return (
    <div>

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Restaurantes</h1>
          <p className="text-gray-500 text-sm">Lista de restaurantes registrados</p>
        </div>
        <button
          onClick={() => { setShowForm(true); setError(""); setSuccess("") }}
          className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm"
        >
          + Agregar restaurante
        </button>
      </div>

      {/* Éxito */}
      {success && !showForm && (
        <div className="mb-4 px-4 py-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">
          {success}
        </div>
      )}

      {/* Formulario */}
      {showForm && (
        <div className="bg-white border rounded-xl p-8 mb-6">
          <h2 className="text-xl font-semibold mb-6">Crear restaurante</h2>

          {error && (
            <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Información básica */}
            <section>
              <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wide mb-3">
                Información básica
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                <div className="md:col-span-2">
                  <label className="text-sm text-gray-600 block mb-1">Nombre</label>
                  <input name="name" value={form.name} onChange={handleChange} required
                    className="w-full border rounded-lg px-3 py-2.5" placeholder="La Fonda Chapina" />
                </div>

                <div className="md:col-span-2">
                  <label className="text-sm text-gray-600 block mb-1">Descripción</label>
                  <textarea name="description" value={form.description} onChange={handleChange} required rows={3}
                    className="w-full border rounded-lg px-3 py-2.5 resize-none" placeholder="Describe el restaurante..." />
                </div>

                <div>
                  <label className="text-sm text-gray-600 block mb-1">Categoría</label>
                  <select name="category" value={form.category} onChange={handleChange} required
                    className="w-full border rounded-lg px-3 py-2.5 bg-white">
                    <option value="">— Selecciona —</option>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div>
                  <label className="text-sm text-gray-600 block mb-1">Rango de precio</label>
                  <select name="priceRange" value={form.priceRange} onChange={handleChange}
                    className="w-full border rounded-lg px-3 py-2.5 bg-white">
                    {PRICE_RANGES.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>

                <div>
                  <label className="text-sm text-gray-600 block mb-1">Precio promedio (Q)</label>
                  <input name="averagePrice" type="number" min="0" step="0.01" value={form.averagePrice} onChange={handleChange} required
                    className="w-full border rounded-lg px-3 py-2.5" placeholder="75.00" />
                </div>

              </div>
            </section>

            {/* Contacto */}
            <section>
              <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wide mb-3">
                Contacto
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-600 block mb-1">Teléfono</label>
                  <input name="phone" value={form.phone} onChange={handleChange} required
                    className="w-full border rounded-lg px-3 py-2.5" placeholder="22345678" />
                </div>
                <div>
                  <label className="text-sm text-gray-600 block mb-1">Email</label>
                  <input name="email" type="email" value={form.email} onChange={handleChange} required
                    className="w-full border rounded-lg px-3 py-2.5" placeholder="contacto@restaurante.com" />
                </div>
              </div>
            </section>

            {/* Dirección */}
            <section>
              <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wide mb-3">
                Dirección
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                <div className="md:col-span-2">
                  <label className="text-sm text-gray-600 block mb-1">Dirección completa</label>
                  <input name="address" value={form.address} onChange={handleChange} required
                    className="w-full border rounded-lg px-3 py-2.5" placeholder="5a Avenida 10-20, Zona 1, Guatemala" />
                </div>

                <div>
                  <label className="text-sm text-gray-600 block mb-1">Calle / No.</label>
                  <input name="street" value={form.addressDetails.street} onChange={handleAddressDetail}
                    className="w-full border rounded-lg px-3 py-2.5" placeholder="5a Avenida 10-20" />
                </div>
                <div>
                  <label className="text-sm text-gray-600 block mb-1">Zona</label>
                  <input name="zone" value={form.addressDetails.zone} onChange={handleAddressDetail}
                    className="w-full border rounded-lg px-3 py-2.5" placeholder="Zona 1" />
                </div>
                <div>
                  <label className="text-sm text-gray-600 block mb-1">Ciudad</label>
                  <input name="city" value={form.addressDetails.city} onChange={handleAddressDetail}
                    className="w-full border rounded-lg px-3 py-2.5" />
                </div>
                <div>
                  <label className="text-sm text-gray-600 block mb-1">Departamento</label>
                  <input name="department" value={form.addressDetails.department} onChange={handleAddressDetail}
                    className="w-full border rounded-lg px-3 py-2.5" />
                </div>

                {/* Coordenadas */}
                <div>
                  <label className="text-sm text-gray-600 block mb-1">Longitud</label>
                  <input type="number" step="any" value={form.location.coordinates[0]}
                    onChange={(e) => handleCoord(0, e.target.value)} required
                    className="w-full border rounded-lg px-3 py-2.5" placeholder="-90.5069" />
                </div>
                <div>
                  <label className="text-sm text-gray-600 block mb-1">Latitud</label>
                  <input type="number" step="any" value={form.location.coordinates[1]}
                    onChange={(e) => handleCoord(1, e.target.value)} required
                    className="w-full border rounded-lg px-3 py-2.5" placeholder="14.6407" />
                </div>

              </div>
            </section>

            {/* Horario */}
            <section>
              <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wide mb-3">
                Horario
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-600 block mb-1">Apertura</label>
                  <input name="openingHours" type="time" value={form.openingHours} onChange={handleChange} required
                    className="w-full border rounded-lg px-3 py-2.5" />
                </div>
                <div>
                  <label className="text-sm text-gray-600 block mb-1">Cierre</label>
                  <input name="closingHours" type="time" value={form.closingHours} onChange={handleChange} required
                    className="w-full border rounded-lg px-3 py-2.5" />
                </div>
              </div>
            </section>

            {/* Features */}
            <section>
              <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wide mb-3">
                Características
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {[
                  { key: "hasParking",          label: "Parqueo" },
                  { key: "hasWifi",             label: "WiFi" },
                  { key: "hasDelivery",         label: "Delivery" },
                  { key: "hasTakeout",          label: "Para llevar" },
                  { key: "acceptsReservations", label: "Reservaciones" },
                ].map(({ key, label }) => (
                  <label key={key} className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                    <input type="checkbox" name={key} checked={form.features[key]} onChange={handleFeature}
                      className="accent-orange-500 w-4 h-4" />
                    {label}
                  </label>
                ))}
              </div>
            </section>

            {/* Métodos de pago */}
            <section>
              <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wide mb-3">
                Métodos de pago
              </h3>
              <div className="flex flex-wrap gap-3">
                {PAYMENT_METHODS.map(method => (
                  <label key={method} className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                    <input type="checkbox" checked={form.paymentMethods.includes(method)}
                      onChange={() => handlePayment(method)} className="accent-orange-500 w-4 h-4" />
                    {method}
                  </label>
                ))}
              </div>
            </section>

            {/* Acciones */}
            <div className="flex gap-3 pt-2">
              <button type="submit" disabled={loading}
                className="bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white px-6 py-3 rounded-lg text-sm">
                {loading ? "Creando..." : "Crear restaurante"}
              </button>
              <button type="button" onClick={() => { setShowForm(false); setError("") }}
                className="border px-6 py-3 rounded-lg text-sm">
                Cancelar
              </button>
            </div>

          </form>
        </div>
      )}

      {/* Lista */}
      <div className="bg-white border rounded-xl p-6">
        <h2 className="text-lg font-semibold mb-4">Restaurantes registrados</h2>

        <input type="text" placeholder="Buscar restaurante..." value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border rounded-lg px-3 py-2 mb-4" />

        <div className="space-y-2">
          {filteredRestaurants.map((r) => (
            <div key={r._id} className="border rounded-lg px-4 py-3 flex justify-between items-center">
              <div>
                <p className="font-medium text-sm">{r.name}</p>
                <p className="text-xs text-gray-500">{r.address}</p>
                <div className="flex gap-2 mt-1">
                  <span className="text-xs text-gray-400">{r.category}</span>
                  <span className="text-xs text-gray-300">·</span>
                  <span className="text-xs text-gray-400">{r.priceRange}</span>
                  {r.ownerUserId && (
                    <>
                      <span className="text-xs text-gray-300">·</span>
                      <span className="text-xs text-orange-500">Con admin asignado</span>
                    </>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-3">
              <span
                className={`text-xs px-2 py-1 rounded-full font-medium ${
                  statusColors[r.status] || "bg-gray-100 text-gray-500"
                }`}
              >
                {r.status}
              </span>

              <button
                onClick={() => openEditModal(r)}
                className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 rounded text-xs"
              >
                Editar / Eliminar
              </button>
            </div>
            </div>
          ))}

          {filteredRestaurants.length === 0 && (
            <p className="text-sm text-gray-400 text-center py-4">No se encontraron restaurantes</p>
          )}
        </div>
      </div>
      
      {showEditModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg">

            <h2 className="text-lg font-semibold mb-4">
              Editar Restaurante
            </h2>

            <div className="space-y-4">

              <div>
                <label className="text-sm text-gray-600 block mb-1">
                  Nombre del restaurante
                </label>
                <input
                  name="name"
                  value={editForm.name}
                  onChange={handleEditChange}
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>

              <div>
                <label className="text-sm text-gray-600 block mb-1">
                  Descripción
                </label>
                <input
                  name="description"
                  value={editForm.description}
                  onChange={handleEditChange}
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>

              <div>
                <label className="text-sm text-gray-600 block mb-1">
                  Dirección
                </label>
                <input
                  name="address"
                  value={editForm.address}
                  onChange={handleEditChange}
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>

              <div>
                <label className="text-sm text-gray-600 block mb-1">
                  Teléfono
                </label>
                <input
                  name="phone"
                  value={editForm.phone}
                  onChange={handleEditChange}
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>

              <div>
                <label className="text-sm text-gray-600 block mb-1">
                  Correo electrónico
                </label>
                <input
                  name="email"
                  value={editForm.email}
                  onChange={handleEditChange}
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>

              <div>
                <label className="text-sm text-gray-600 block mb-1">
                  Precio promedio
                </label>
                <input
                  name="averagePrice"
                  value={editForm.averagePrice}
                  onChange={handleEditChange}
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>

            </div>

            <div className="flex justify-between mt-6">

              <button
                onClick={handleDeleteRestaurant}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
              >
                Eliminar
              </button>

              <div className="flex gap-2">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="border px-4 py-2 rounded-lg"
                >
                  Cancelar
                </button>

                <button
                  onClick={handleUpdateRestaurant}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg"
                >
                  Guardar cambios
                </button>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  )
}