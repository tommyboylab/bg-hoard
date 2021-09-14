import styles from './app.module.scss';
import { getAllGames } from '../fake-api';
import { Route, Link } from 'react-router-dom';
import { StoreFeatureGameDetail } from '@bg-hoard/store/feature-game-detail';
import { Header } from '@bg-hoard/store/ui-shared';
import { formatRating } from '@bg-hoard/store/util-formatters';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';

export const App = () => {
  return (
    <>
    <Header title="Board Game Hoard" />
    <div className={styles.container}>
      <div className={styles['games-layout']}>
        {getAllGames().map((x) => (
          <Link to={`/game/${x.id}`} key={x.id}>
          <Card key={x.id} className={styles['game-card']}>
            <CardActionArea>
              <CardMedia
                className={styles['game-card-media']}
                image={x.image}
                title={x.name}
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="h2">
                  {x.name}
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                  {x.description}
                </Typography>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  component="p"
                  className={styles['game-rating']}
                >
                  <strong>Rating:</strong> {formatRating(x.rating)}
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
          </Link>
        ))}
      </div>
      <Route path="/game/:id" component={StoreFeatureGameDetail} />
    </div>
      </>
  );
};

export default App;