import classes from "./error.module.css";

const Error = () => {
  return (
    <div className={classes.ErrorNoticeWrapper}>
      <h1 className={classes.NotFound404}>404</h1>
      <div className={classes.ErrorTextWrapper}>
        <h2 className={classes.NotFoundHeading}>Oops!</h2>
        <p className={classes.NotFoundDetails}>
          We can't find the city you are looking for.
        </p>
        <button name="tryAgain" type="button">
          Try again
        </button>
      </div>
    </div>
  );
};

export default Error;
