import UrlForm from '../components/UrlForm';
import { Container, Typography } from '@mui/material';

function HomePage() {
  return (
    <Container>
      <Typography variant="h4" gutterBottom>URL Shortener</Typography>
      <UrlForm />
    </Container>
  );
}

export default HomePage;
