import json
import random
from datetime import datetime, timedelta
import uuid

# Lista de produtos possíveis para criar variedade
produtos = [
    "lápis", "caneta", "caderno", "borracha", "apontador", "régua", "tesoura", 
    "cola", "marcador", "post-it", "grampeador", "clipes", "pasta", "fichário",
    "calculadora", "agenda", "bloco de notas", "estojo", "corretivo", "pincel",
    "tinta", "papel sulfite", "papel cartão", "cartolina", "etiquetas",
    "mochila", "lapiseira", "refil", "giz de cera", "tinta guache",
    "compasso", "transferidor", "esquadro", "envelope", "classificador",
    "porta-lápis", "marca-texto", "fita adesiva", "cola bastão", "carimbo"
]

# Função para gerar um item de pedido
def gerar_item():
    product = random.choice(produtos)
    quantity = random.randint(1, 100)
    price = round(random.uniform(0.5, 50.0), 2)
    return {
        "product": product,
        "quantity": quantity,
        "price": price
    }

# Função para gerar um pedido completo
def gerar_pedido(order_id, client_id, data):
    # Gerar de 1 a 8 itens para cada pedido
    num_items = random.randint(1, 8)
    items = [gerar_item() for _ in range(num_items)]
    
    # Calcular o valor bruto total
    gross_value = round(sum(item["quantity"] * item["price"] for item in items), 2)
    
    # Status possíveis para o pedido
    status_options = ["paid", "pending", "canceled", "delivered", "processing"]
    status_weights = [0.6, 0.2, 0.05, 0.1, 0.05]  # Maior probabilidade para "paid"
    
    # Timestamp em formato Unix (milissegundos)
    timestamp = int(data.timestamp() * 1000)
    
    return {
        "key": str(client_id),  # A key deve ser igual ao clientID
        "value": {
            "orderID": order_id,
            "clientID": client_id,
            "grossValue": gross_value,
            "items": items,
            "status_order": random.choices(status_options, status_weights)[0],
            "created_at": data.strftime("%Y-%m-%dT%H:%M:%SZ")
        },
        "timestamp": str(timestamp)
    }

# Função principal para gerar o payload
def gerar_payload(num_pedidos=150):
    # Distribuição de clientes: alguns terão múltiplos pedidos
    # Vamos criar entre 200 e 400 clientes diferentes
    num_clientes = random.randint(200, 400)
    client_ids = list(range(1, num_clientes + 1))
    
    # Data de início para os pedidos (começando 30 dias atrás)
    data_inicio = datetime.now() - timedelta(days=30)
    
    # Lista para armazenar todos os pedidos
    pedidos = []
    
    # Contador para order_id
    order_id = 1001
    
    # Gerar pedidos
    for i in range(num_pedidos):
        # Escolher um cliente (com maior probabilidade para clientes com IDs mais baixos)
        client_id = random.choices(
            client_ids, 
            weights=[1/max(1, (id_**0.8)) for id_ in client_ids]
        )[0]
        
        # Gerar uma data aleatória nos últimos 30 dias
        dias_aleatorios = random.randint(0, 30)
        horas_aleatorias = random.randint(0, 23)
        minutos_aleatorios = random.randint(0, 59)
        data = data_inicio + timedelta(
            days=dias_aleatorios, 
            hours=horas_aleatorias, 
            minutes=minutos_aleatorios
        )
        
        # Gerar o pedido e adicionar à lista
        pedido = gerar_pedido(order_id, client_id, data)
        pedidos.append(pedido)
        
        # Incrementar o order_id para o próximo pedido
        order_id += 1
    
    # Criar o payload final
    payload = {
        "topicName": "orders",
        "messages": pedidos
    }
    
    return payload

# Gerar o payload com 1000 pedidos
payload = gerar_payload(1000)

# Salvar o payload em um arquivo JSON
with open('orders_payload.json', 'w', encoding='utf-8') as f:
    json.dump(payload, f, ensure_ascii=False, indent=2)

print(f"Arquivo 'orders_payload.json' gerado com sucesso contendo 1000 pedidos!")

# Para visualizar uma amostra do resultado, mostrar os primeiros 2 pedidos
print("\nAmostra dos primeiros 2 pedidos:")
print(json.dumps(payload["messages"][:2], ensure_ascii=False, indent=2))