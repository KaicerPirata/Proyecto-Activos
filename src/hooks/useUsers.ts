import { usersService } from "@/services/users.service";
import { FormUser } from "@/types/user.types";
import { useEffect, useState } from "react";

export function useUserSearch() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<FormUser[]>([]);
    const [isSearching, setIsSearching] = useState(false);

    useEffect(() => {
        const debounce = setTimeout(async () => {
            if (!query.trim()) {
                setResults([]);
                return;
            }

            try {
                setIsSearching(true);

                const res = await usersService.search(query);

                setResults(res.data);
            } catch(error) {
                console.error(error);
            } finally {
                setIsSearching(false);
            }
        }, 400);

        return () => clearTimeout(debounce);
    }, [query]);

    return {
        query,
        setQuery,
        results,
        isSearching,
        clearResults: () => setResults([])
    };
}
