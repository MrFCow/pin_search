import React from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
// import GridList from '@material-ui/core/GridList';
// import GridListTile from '@material-ui/core/GridListTile';

import ResultPopUp from "./resultPopup";

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    // justifyContent: 'space-around',
    overflow: 'hidden',
		backgroundColor: theme.palette.background.paper,
		// maxWidth: "80%",
  },
  // gridList: {
  //   width: 500,
  //   // height: 450,
  // },
}));


export default function ImageGridList(props) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      {/* <GridList cellHeight={160} className={classes.gridList} cols={3}>
        {props.data.map((item) => (
          <GridListTile key={item.id} cols={1}>
            <ResultPopUp item={item}/>
          </GridListTile>
        ))}
      </GridList> */}
			{props.data.map((item)=>{
					return <ResultPopUp item={item} key={item.id}/>
			})}
    </div>
  );
}