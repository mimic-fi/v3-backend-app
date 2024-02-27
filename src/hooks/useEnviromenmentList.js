import { useState, useEffect } from 'react';
import axios from 'axios';

const useEnvironmentList = (id) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!id) return; // Optionally, skip the fetch if `id` is not available

        const fetchData = async () => {
            setLoading(true);
            try {
                const url = 'https://api.mimic.fi/public/environments/';
                const { data } = await axios.get(url);
                const found = data.find(e => e.mimicId.toLowerCase() === id.toLowerCase());
                setData(found);
            } catch (error) {
                console.error(error);
                setError(error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]); // This hook will re-run whenever the `id` changes

    return { data, loading, error };
};

export default useEnvironmentList;
