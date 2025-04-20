import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { CertificationScheme, Province, Schedule } from "@shared/schema";

const SearchFilter = () => {
  const [selectedScheme, setSelectedScheme] = useState("");
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedSchedule, setSelectedSchedule] = useState("");

  const { data: schemes } = useQuery<CertificationScheme[]>({
    queryKey: ["/api/schemes"],
  });

  const { data: provinces } = useQuery<Province[]>({
    queryKey: ["/api/provinces"],
  });

  const { data: schedules } = useQuery<Schedule[]>({
    queryKey: ["/api/schedules"],
  });

  const handleSearch = () => {
    // In a real app, this would navigate to search results
    console.log("Search with:", { selectedScheme, selectedProvince, selectedSchedule });
  };

  return (
    <section className="bg-white shadow-md relative -mt-8 md:-mt-16 z-20 rounded-lg mx-4 md:mx-auto max-w-5xl">
      <div className="p-4 md:p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Pilih Skema Sertifikasi
            </label>
            <Select value={selectedScheme} onValueChange={setSelectedScheme}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Pilih Skema Sertifikasi" />
              </SelectTrigger>
              <SelectContent>
                {schemes?.map((scheme) => (
                  <SelectItem key={scheme.id} value={scheme.slug}>
                    {scheme.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Pilih Provinsi
            </label>
            <Select value={selectedProvince} onValueChange={setSelectedProvince}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Di Provinsi Manakah Anda?" />
              </SelectTrigger>
              <SelectContent>
                {provinces?.map((province) => (
                  <SelectItem key={province.id} value={province.code}>
                    {province.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Jadwal
            </label>
            <Select value={selectedSchedule} onValueChange={setSelectedSchedule}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Pilih Jadwal" />
              </SelectTrigger>
              <SelectContent>
                {schedules?.map((schedule) => (
                  <SelectItem key={schedule.id} value={schedule.id.toString()}>
                    {schedule.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-end">
            <Button 
              className="w-full bg-primary hover:bg-primary-dark text-white"
              onClick={handleSearch}
            >
              <Search className="mr-2 h-4 w-4" /> Cari
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SearchFilter;
