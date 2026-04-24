import { useEffect, useState } from "react"
import { getRestaurantsRequest } from "../../../shared/api/restaurants.js"

export const RestaurantesPage = () => {
  const [restaurants, setRestaurants] = useState([])
  const [search, setSearch] = useState("")

  const getRestaurants = async () => {
    try {
      const { data } = await getRestaurantsRequest()
      setRestaurants(data.data)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getRestaurants()
  }, [])

  const filteredRestaurants = restaurants.filter(r =>
    r.name.toLowerCase().includes(search.toLowerCase()) ||
    r.address.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>

      <div className="mb-6">
        <h1 className="text-2xl font-semibold">
          Restaurantes
        </h1>
        <p className="text-gray-500 text-sm">
          Lista de restaurantes registrados
        </p>
      </div>

      <div className="bg-white border rounded-xl p-6">

        <input
          type="text"
          placeholder="Buscar restaurante..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border rounded-lg px-3 py-2 mb-4"
        />

        <div className="space-y-2">
          {filteredRestaurants.map((restaurant) => (
            <div
              key={restaurant._id}
              className="border rounded-lg px-3 py-2 flex justify-between"
            >
              <div>
                <p className="font-medium text-sm">
                  {restaurant.name}
                </p>
                <p className="text-xs text-gray-500">
                  {restaurant.address}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>

    </div>
  )
}