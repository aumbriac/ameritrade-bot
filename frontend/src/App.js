import './App.css';
import { get } from 'axios'
import { Accordion, Alert, Badge, Card, Code, Group, Text } from '@mantine/core';
import { useCallback, useEffect, useState } from 'react';
import { MantineProvider } from '@mantine/core';
import { IconNews } from '@tabler/icons';

const formatNumber = (x) => x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")

function App() {
  const [articles, setArticles] = useState([])

  const getData = useCallback(async () => {
    const { data } = await get(`http://localhost:3333/getMovers`)
    setArticles(data)
  }, [])

  useEffect(() => {
    let isSubscribed = true
    if (isSubscribed){
      getData()
    }
    const timer = setInterval(() => {
      if (isSubscribed){
        getData()
      }
    }, (60 * 1000))
    return () => {
      clearInterval(timer)
      isSubscribed = false
    }
  }, [getData])

  return (
    <MantineProvider
      withGlobalStyles
      withNormalizeCSS
      theme={{
        colorScheme: "dark",
      }}
    >
      <Accordion>
        {articles?.map((article, idx) => (
          <Accordion.Item value={new Date(article[idx].timestamp).toLocaleString()}>
            <Accordion.Control icon={<IconNews size={20} color={"#fff"} />}>
              <Text
                gradient={{ from: "cyan", to: "pink", deg: 45 }}
                variant="gradient"
              >
                {new Date(article[idx].timestamp).toLocaleString()}
              </Text>
            </Accordion.Control>
            <Accordion.Panel>
              {article?.map(
                  ({
                    symbol,
                    description,
                    change,
                    direction,
                    last,
                    totalVolume,
                    body,
                  }) => (
                    <Card shadow="sm" p="lg" radius="md" mb={8} withBorder>
                      <Group position="together" mt="md" mb="xs">
                        {description.split("-")[0]}
                        <Badge color="pink" variant="light">
                          {symbol}
                        </Badge>
                        <Text color={'#fff'}>${last.toFixed(2)}</Text>
                        <Text color={direction === 'up' ? 'green' : 'red'}>{direction === 'up' && '+'}{change.toFixed(2)}</Text>
                        <Text color={'#fff'}>{formatNumber(totalVolume)} vol</Text>
                      </Group>
                      <Text
                        size="sm"
                        gradient={{ from: "#fff", to: "#ccc", deg: 45 }}
                        variant="gradient"
                      >
                        {body}
                      </Text>
                    </Card>
                  )
                )}
            </Accordion.Panel>
          </Accordion.Item>
          ))}
      </Accordion>
      {!articles.length && <Alert style={{ textAlign: 'center' }}>No articles yet...enter the <Code>/server</Code> directory and run <Code>node server</Code> or <Code>node server</Code> to start the backend. By default, it will run every 5 minutes if the market is open.</Alert>}
    </MantineProvider>
  );  
}

export default App;
