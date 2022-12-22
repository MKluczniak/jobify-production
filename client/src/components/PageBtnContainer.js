import { useAppContext } from "../context/appContext"
import { HiChevronDoubleLeft, HiChevronDoubleRight } from "react-icons/hi"
import Wrapper from "../assets/wrappers/PageBtnContainer"

const PageBtnContainer = () => {
  const { numOfPages, page, changePage } = useAppContext()

  //creating an array
  const pages = Array.from({ length: numOfPages }, (_, index) => {
    //using the index whatever is going to be returned from that function will be place inside of the pages
    return index + 1
  })
  //we got back array with item equal whatever is the value ??

  const nextPage = () => {
    let newPage = page + 1
    if (newPage > numOfPages) {
      newPage = 1
    }
    changePage(newPage)
  }
  const prevPage = () => {
    let newPage = page - 1
    if (newPage < 1) {
      newPage = numOfPages
    }
    changePage(newPage)
  }

  return (
    <Wrapper>
      <button className="prev-btn" onClick={prevPage}>
        prev
        <HiChevronDoubleLeft />
      </button>
      <div className="btn-container">
        {pages.map((pageNumber) => {
          return (
            <button
              type="button"
              className={pageNumber === page ? "pageBtn active" : "pageBtn"}
              key={pageNumber}
              onClick={() => changePage(pageNumber)}
            >
              {pageNumber}
            </button>
          )
        })}
      </div>
      <button className="next-btn" onClick={nextPage}>
        next
        <HiChevronDoubleRight />
      </button>
    </Wrapper>
  )
}

export default PageBtnContainer
