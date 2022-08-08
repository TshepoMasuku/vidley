import React from "react";
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";

const SortGenre = ({
  onGenreClick,
  genreItems,
  selectedGenre,
  textProperty,
  valueProperty,
}) => {
  return (
    <ButtonGroup size="lg" vertical>
      {genreItems.map((genre) => (
        <Button
          key={genre[valueProperty]}
          onClick={() => onGenreClick(genre)}
          active={selectedGenre._id === genre[valueProperty] ? true : false}
        >
          {genre[textProperty]}
        </Button>
      ))}
    </ButtonGroup>
  );
};

SortGenre.defaultProps = {
  textProperty: "name",
  valueProperty: "_id",
};

export default SortGenre;
