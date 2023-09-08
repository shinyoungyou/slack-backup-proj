import { useEffect, useState, useRef } from 'react';
import { Grid, Paper } from "@mui/material";
import MessageList from "./MessageList";
import { useAppDispatch, useAppSelector } from "@/stores/configureStore";
import { setPageNumber } from "@/stores/messagesSlice";
import { messageSelectors } from "@/stores/messagesSlice";
import { AutoSizer, InfiniteLoader, List, WindowScroller, CellMeasurerCache } from "react-virtualized";

export default function FeedPage() {
  const { messagesLoaded, pagination } = useAppSelector((state) => state.messages);
  const [loadingNext, setLoadingNext] = useState(false);
  const messages = useAppSelector(messageSelectors.selectAll);
  const dispatch = useAppDispatch();

  const cache = useRef(
    new CellMeasurerCache({
      fixedWidth: true,
      defaultHeight: 150,
    })
  );

  const  handleGetNext = async () => {
    setLoadingNext(true);
    await dispatch(setPageNumber({ pageNumber: pagination!.currentPage + 1}));
    return;
  }

  useEffect(() => {
    if (messagesLoaded) {
      setLoadingNext(false)
    }
  }, [messagesLoaded]);

  return (
    <div style={{ width: "100%", height: "100vh" }}>
    <AutoSizer>
      {({ height, width }) => (
        <WindowScroller>
          {({ isScrolling, onChildScroll, scrollTop }) => (
            <InfiniteLoader
              // isRowLoaded={(index) => !!messages[index as unknown as number]}
              isRowLoaded={(index) => messagesLoaded}
              loadMoreRows={() => !loadingNext &&
                !!pagination &&
                pagination.currentPage < pagination.totalPages && handleGetNext as any}
              rowCount={pagination?.totalItems || 0} // Set the total number of rows
            >
              {({ onRowsRendered, registerChild }) => (
                
                <List
                  autoHeight
                  height={height}
                  isScrolling={isScrolling}
                  onScroll={onChildScroll}
                  scrollTop={scrollTop}
                  width={width}
                  rowCount={messages?.length || 0} // Set the total number of rows
                  rowHeight={cache.current.rowHeight}
                  deferredMeasurementCache={cache.current}
                  rowRenderer={({ key, index, style, parent}) => (
                      <MessageList key={key} cache={cache} index={index} style={style} parent={parent} />
                  )} // Use your custom row rendering function
                  onRowsRendered={onRowsRendered}
                  ref={registerChild}
                />
               
              )}
            </InfiniteLoader>
          )}
        </WindowScroller>
      )}
    </AutoSizer>
  </div>
  );
}
