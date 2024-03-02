import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const ApiDataContext = createContext();

export const ApiDataProvider = ({ children }) => {
  const [groups, setGroups] = useState([]);
  const [suubGroups, setSubGroups] = useState([]);
  const [mainGroups, setMainGroups] = useState([]);

  const [radioo, setRadio] = useState([
    { id: 1, label: 'عرضه داخلی', checked: false },
    { id: 2, label: 'عرضه صادراتی', checked: false },
    { id: 3, label: 'بازار فرعی', checked: false },
    { id: 4, label: 'عرضه املاک', checked: false },
    { id: 5, label: 'عرضه مستقلات', checked: false },
    // { id: 6, label: 'بازار خودرو', checked: false },
    // { id: 7, label: 'بازار املاک', checked: false },
  ]);

  useEffect(() => {
    const fetchData = async (url, setData) => {
      try {
        const response = await axios.get(url);
        setData(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData('https://api.ibrokers.ir/bourse/group/group/', setGroups);
    fetchData('https://api.ibrokers.ir/bourse/group/sub-group/', setSubGroups);
    fetchData('https://api.ibrokers.ir/bourse/group/main-group/', setMainGroups);
  }, []);


  return (
    <ApiDataContext.Provider value={{ groups, suubGroups, mainGroups, radioo }}>
      {children}
    </ApiDataContext.Provider>
  );
};

export const useApiData = () => useContext(ApiDataContext);