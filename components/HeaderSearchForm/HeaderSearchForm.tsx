import { FiSearch } from 'react-icons/fi';
import './HeaderSearchForm.scss';

const HeaderSearchForm = () => (
    <div className="header-search-form">
        <form action="/search" method="get">
            <input type="text" name="query" id="chat-search" placeholder="Search..." />
            <button type="submit" className="searchButton">
                <FiSearch size="15px" />
            </button>
        </form>
    </div>
);

export default HeaderSearchForm;
