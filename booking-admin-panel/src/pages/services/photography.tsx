import AdminLayout from "@/components/AdminLayout";
import ServiceForm from "@/components/ServiceForm";
import { useServices } from "@/hooks/useServices";
import { PhotographyService } from "@/types/types";
import { useState } from "react";
import api from "@/lib/axios";
import { useQueryClient } from "@tanstack/react-query";

export default function PhotographyServicesPage() {
  const { data: services, isLoading, error } = useServices();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedService, setSelectedService] =
    useState<PhotographyService | null>(null);
  const queryClient = useQueryClient();

  const openAddForm = () => {
    setSelectedService(null);
    setIsFormOpen(true);
  };

  const openEditForm = (service: PhotographyService) => {
    setSelectedService(service);
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (formData: Omit<PhotographyService, "id">) => {
    try {
      if (selectedService) {
        await api.put(
          `/api/photography-services/${selectedService.id}`,
          formData
        );
      } else {
        await api.post("/api/photography-services", formData);
      }
      setIsFormOpen(false);
      await queryClient.invalidateQueries({
        queryKey: ["photography-services"],
      });
    } catch (err) {
      console.error("Failed to save service", err);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this service?")) {
      try {
        await api.delete(`/api/photography-services/${id}`);
        await queryClient.invalidateQueries({
          queryKey: ["photography-services"],
        });
      } catch (err) {
        console.error("Delete failed", err);
      }
    }
  };

  const toggleServiceStatus = async (id: number, currentStatus: boolean) => {
    try {
      await api.patch(`/api/photography-services/${id}/toggle-active`, {
        active: !currentStatus,
      });
      await queryClient.invalidateQueries({
        queryKey: ["photography-services"],
      });
    } catch (err) {
      console.error("Toggle failed", err);
    }
  };

  return (
    <AdminLayout>
      <main className="flex-1 p-4 bg-gray-100 overflow-x-hidden">
        <div className="w-full max-w-full md:max-w-4xl mx-auto overflow-x-hidden">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">📸 Photography Services</h1>
            <button
              onClick={openAddForm}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded w-full mx-auto overflow-y-auto overflow-x-hidden max-h-[90vh]"
            >
              + Add New
            </button>
          </div>

          {isLoading && <p>Loading...</p>}
          {error && <p className="text-red-500">Failed to load services</p>}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services
              ?.slice()
              .sort((a, b) => a.id - b.id)
              .map((service) => (
                <div
                  key={service.id}
                  className="bg-white border rounded-xl shadow p-4 flex flex-col justify-between"
                >
                  <div>
                    <img
                      src={service.imageUrl}
                      alt={service.name}
                      className="w-full h-48 object-cover rounded-md mb-4"
                    />
                    <h2 className="text-xl font-semibold">{service.name}</h2>
                    <p className="text-gray-600 text-sm mt-1">
                      {service.description}
                    </p>
                    <p className="mt-2 text-sm text-gray-500">
                      💲${service.price.toFixed(2)} | 💰 Deposit: $
                      {service.depositAmount.toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-500">
                      ⏱ {service.duration}
                    </p>
                    <p
                      className={`mt-2 text-sm font-semibold ${
                        service.active ? "text-green-600" : "text-red-500"
                      }`}
                    >
                      {service.active ? "✅ Active" : "🚫 Disabled"}
                    </p>
                  </div>

                  <div className="flex flex-wrap justify-between mt-4 gap-2">
                    <button
                      onClick={() => openEditForm(service)}
                      className="text-blue-600 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(service.id)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() =>
                        toggleServiceStatus(service.id, service.active)
                      }
                      className="text-sm bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
                    >
                      {service.active ? "Deactivate" : "Activate"}
                    </button>
                  </div>
                </div>
              ))}
          </div>

          {isFormOpen && (
            <ServiceForm
              initialData={selectedService}
              onSubmit={handleFormSubmit}
              onClose={() => setIsFormOpen(false)}
            />
          )}
        </div>
      </main>
    </AdminLayout>
  );
}
