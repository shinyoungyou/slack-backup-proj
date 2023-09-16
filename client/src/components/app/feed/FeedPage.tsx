import { useEffect, useState, useRef } from 'react';
import { Grid, Paper } from "@mui/material";
import MessageList from "./MessageList";
import { useAppDispatch, useAppSelector } from "@/stores/configureStore";
import { setPageNumber, setMessageParams } from "@/stores/messagesSlice";
import { messageSelectors } from "@/stores/messagesSlice";
import { AutoSizer, InfiniteLoader, List, WindowScroller, CellMeasurerCache } from "react-virtualized";
import { format, parse } from 'date-fns';

export default function FeedPage() {
  const { messagesLoaded, pagination } = useAppSelector((state) => state.messages);
  const [loadingNext, setLoadingNext] = useState(false);
  const messages = useAppSelector(messageSelectors.selectAll);
  const dispatch = useAppDispatch();
  const [selectDate, setSelectDate] = useState<string>('');
  const [theSelectedDate, setTheSelectedDate] = useState<string>('');
  const [prevScrollTop, setPrevScrollTop] = useState(0);
  const [dateExists, setDateExists] = useState<boolean[]>([]);
  const [dateExistsInMessages, setDateExistsInMessages] = useState<boolean>(true);

  useEffect(() => {
    if (messagesLoaded) {
      setLoadingNext(false);
      dispatch(setMessageParams({ selectedDate: '' }));
    }
  }, [messagesLoaded]);  

  useEffect(() => {
    if (theSelectedDate !== '') {
      setDateExistsInMessages(dateExists.some((bool) => bool));
    }
  }, [dateExists, theSelectedDate]);   

  useEffect(() => {        
    if (theSelectedDate !== '' && !dateExistsInMessages) {  
      console.log("-----------loadSelectedDate--------");
      console.log("loadSelectedDate: "+!dateExistsInMessages);
      console.log("theSelectedDate: "+theSelectedDate);
      const original = parse(theSelectedDate, 'EEE, MMM dd yyyy', new Date());
      console.log("original: "+original.toISOString());
      console.log("-----------loadSelectedDate--------");
      dispatch(setMessageParams({ selectedDate: original.toISOString() }));
    }
  }, [dateExistsInMessages]); 

  useEffect(() => {   
    console.log("selectDate: "+selectDate);
    if (selectDate !== '') {
      setTheSelectedDate(selectDate);
    }
  }, [selectDate]); 

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

  return (
    <div style={{ width: "100%", height: "100vh" }}>
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
                
                // if (isScrollDown && pagination) {
                //   messagesLoaded && pagination.currentPage < pagination.totalPages && dispatch(setPageNumber({ pageNumber: pagination!.currentPage + 1}));
                // }

                // console.log("isScrollDown: "+isScrollDown);
                // console.log("messagesLoaded: "+messagesLoaded);
                // console.log("loadingNext: "+loadingNext);
                // console.log("isScrolling: "+isScrolling);    
                // console.log("Overall: "+isScrollDown && messagesLoaded && !loadingNext && isScrolling && !!pagination && pagination.currentPage < pagination.totalPages && !!messages[index]);
                            
                return isScrollDown && messagesLoaded 
                && !loadingNext 
                && isScrolling && !!pagination &&
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
                      <MessageList key={key} keyProp={key} cache={cache} index={index} style={style} parent={parent} selectDate={selectDate} setSelectDate={setSelectDate} dateExists={dateExists} setDateExists={setDateExists} theSelectedDate={theSelectedDate}/>
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
