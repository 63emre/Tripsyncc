import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const SearchBar: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <form onSubmit={handleSearch} className="w-full max-w-lg mx-auto">
      <div className="flex items-center border border-gray-300 rounded-full overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Şehir veya ülke ara..."
          className="w-full py-3 px-4 focus:outline-none"
        />
        <button
          type="submit"
          className="bg-[#9370DB] hover:bg-[#7851B8] text-white px-6 py-3 focus:outline-none transition-colors duration-200"
        >
          Ara
        </button>
      </div>
    </form>
  );
};

export default SearchBar; 