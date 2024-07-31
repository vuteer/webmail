import { Scheduler } from "@bitnoi.se/react-scheduler"

export default function App() {
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
      setIsLoading(true);

      // fetching data
      
      setIsLoading(false);
    }, []);

    return (
       <Scheduler
        // decide when to show loading indicators
        isLoading={isLoading}
        // your data
        data={data}
        // callback when user click's on one of the grid's tile
        onItemClick={(clickedItem) => console.log(clickedItem)}
        // filter function that let's you handling filtering on your end
        onFilterData={() => {
          // filter your data
        }}
        // callback when user clicks clearing filter button
        onClearFilterData={() => {
          // clear all your filters
        }}
        config={{
          /* 
            change filter button state based on your filters
            < 0 - filter button invisible,
            0 - filter button visible, no filter applied, clear filters button invisible,
            > 0 - filter button visible, filters applied (clear filters button will be visible)
          */
          filterButtonState: 0,
          // decide start zoom variant (0 - weeks, 1 - days)
          zoom: 0,
          // select language for scheduler
          lang: "en",
          // decide how many resources show per one page
          maxRecordsPerPage: 20,
        }}
      />
    );
  }