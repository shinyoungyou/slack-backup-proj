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
  const [selectDate, setSelectDate] = useState<string>('');
  const [prevScrollTop, setPrevScrollTop] = useState(0);

  const cache = useRef(
    new CellMeasurerCache({
      fixedWidth: true,
      defaultHeight: 150,
    })
  );

  const handleGetNext = async () => {
    setLoadingNext(true);
    dispatch(setPageNumber({ pageNumber: pagination!.currentPage + 1}));
    return Promise<any>;
  }

  useEffect(() => {
    if (messagesLoaded) {
      setLoadingNext(false);
    }
  }, [messagesLoaded]);  

  return (
    <div style={{ width: "100%", height: "100vh" }}>
       {loadingNext && <span>loading more repositories..</span>}
    <AutoSizer>
      {({ height, width }) => (
        <WindowScroller>
          {({ isScrolling, onChildScroll, scrollTop }) => (
            <InfiniteLoader
              isRowLoaded={({index}) => {
                let isScrollDown = prevScrollTop < scrollTop;
                if (prevScrollTop !== scrollTop) {
                  setPrevScrollTop(scrollTop);
                };                
                
                return isScrollDown && messagesLoaded && !loadingNext && isScrolling && !!pagination &&
                pagination.currentPage < pagination.totalPages && !!messages[index];
              }}
              loadMoreRows={handleGetNext as any}
              rowCount={pagination?.totalItems || 0} 
            >
              {({ onRowsRendered, registerChild }) => (
                
                <List
                  autoHeight
                  height={height}
                  isScrolling={isScrolling}
                  onScroll={onChildScroll}
                  scrollTop={scrollTop}
                  width={width}
                  rowCount={messages?.length || 0} 
                  rowHeight={cache.current.rowHeight}
                  deferredMeasurementCache={cache.current}
                  rowRenderer={({ key, index, style, parent}) => (
                      <MessageList key={key} keyProp={key} cache={cache} index={index} style={style} parent={parent} selectDate={selectDate} setSelectDate={setSelectDate}/>
                  )} 
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
