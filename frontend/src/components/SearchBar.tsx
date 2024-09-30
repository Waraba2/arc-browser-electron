import { useState } from "react";
import IconButton from "@mui/material/IconButton";
import InsertLinkTwoToneIcon from '@mui/icons-material/InsertLinkTwoTone';
import { FilledInput, InputAdornment } from "@mui/material";
import InputLabel from '@mui/material/InputLabel';
import FormControl from "@mui/material/FormControl";
import { gql, useMutation } from '@apollo/client'
import { ALL_LINKS } from "../App";

const CREATE_LINK = gql`
mutation createPerson($link: String!) {
  addLink(
    link: $link,
  ) {
    link
  }
}
`


const SearchBar = ({setSearchQuery}) => {
  const [query, setQuery] = useState('');
  const [ createLink ] = useMutation(CREATE_LINK, {
    refetchQueries: [ { query: ALL_LINKS } ]
  })

    const handleSubmit = async (e) => {
    e.preventDefault();
    if (query) {
      try {
        // Execute the mutation to create a new link
        const { data } = await createLink({ variables: { link: query } });
        
        // Set the search query to the newly added link
        if (data) {
          setSearchQuery(query);
        }

        // Clear the input field
        setQuery('');
      } catch (error) {
        console.error('Error creating link:', error);
      }
    }
  };

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   if (query) {
  //     setSearchQuery(query);
  //     setQuery('');
  //   }
  // };
  return (
    <form onSubmit={handleSubmit}>
      <FormControl sx={{ m: 1, width: '25ch' }} variant="filled">
        <InputLabel htmlFor="search-box">Search</InputLabel>
        <FilledInput
          id="search-box"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          endAdornment={
            <InputAdornment position="end">
              <IconButton type="submit" aria-label="search">
                <InsertLinkTwoToneIcon style={{ fill: "gray" }} />
              </IconButton>
            </InputAdornment>
          }
          label="Search"
        />
      </FormControl>
    </form>
  );
}

export default SearchBar
