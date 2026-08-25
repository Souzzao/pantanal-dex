from pathlib import Path

root = Path('/home/ubuntu/pantanal-dex/handoffs/checklists')
root.mkdir(parents=True, exist_ok=True)

phases = [
    'Contratos e meta', 'Inventário e métricas', 'Governança de fontes', 'Licenciamento comercial',
    'Auditoria P1 mamíferos', 'Auditoria P1 aves', 'Auditoria P1 répteis', 'Auditoria P1 anfíbios',
    'Auditoria P1 peixes', 'Auditoria P1 invertebrados', 'Arquitetura modular', 'Pipeline de lotes',
    'IDs e taxonomia', 'Ocorrência pantaneira', 'Conservação oficial', 'Imagens e créditos',
    'Índice derivado', 'Busca normalizada', 'Filtros combinados', 'Paginação e ordenação',
    'Ficha de espécie', 'Home e descoberta', 'Avistamentos', 'Edição e exclusão',
    'Câmera e galeria', 'GPS e permissões', 'Mapa e privacidade', 'Persistência offline',
    'Importação segura', 'Exportação estável', 'PT/EN/ES', 'Acessibilidade',
    'Estados de interface', 'Tratamento de erros', 'Performance', 'Testes unitários',
    'Testes de integração', 'Testes nativos mockados', 'Revisão visual', 'Revisão científica',
    'Revisão de licenças', 'Revisão de segurança', 'Observabilidade', 'Handoff',
    'Branches e commits', 'Pull Requests', 'Integração seletiva', 'Release candidate',
    'MVP 500 espécies', 'MVP funcional', 'Polimento final'
]
phases = phases[:50]

common = [
    'Ler TODO, HANDOFF e estado do Git antes de começar',
    'Executar a alteração verificável do passo e registrar arquivos afetados',
    'Adicionar ou atualizar teste determinístico para o caso principal e um extremo',
    'Atualizar documentação, contagem, riscos e bloqueios com evidência',
    'Rodar check, lint, test, diff check e watchdog; corrigir falhas antes de avançar',
    'Commitar, fazer push, abrir/atualizar PR e registrar resultado no handoff',
]

agent1 = {
    'title': 'Agente 1 — Coordenador',
    'slug': 'agente-1-coordenador-300-pontos',
    'specific': [
        'Confirmar dependências, responsável, critério de aceite e não-regressão',
        'Atualizar métrica de espécies públicas, modulares, verificadas e bloqueadas',
        'Revisar a evidência do lote contra os contratos e a política comercial',
        'Verificar que o trabalho das Contas 2 e 3 está separado e rastreável',
        'Comparar PR, testes, documentação e risco antes de aprovar integração',
        'Definir o próximo bloco desbloqueado e cobrar alternativa para bloqueios reais',
    ],
}
agent2 = {
    'title': 'Agente 2 — Catálogo Científico',
    'slug': 'agente-2-catalogo-300-pontos',
    'specific': [
        'Selecionar espécies reais prioritárias sem duplicar IDs ou inventar taxons',
        'Preencher contrato científico completo com linguagem revisada e fonte',
        'Comprovar ocorrência no Pantanal; bacia ampla não vale como prova local',
        'Conferir cada imagem específica, autor, URL e licença comercial individual',
        'Manter conservação vazia quando não houver fonte oficial ICMBio/MMA',
        'Entregar lote incremental com contagem antes/depois e lacunas explícitas',
    ],
}
agent3 = {
    'title': 'Agente 3 — UX, Qualidade e Nativo',
    'slug': 'agente-3-qualidade-300-pontos',
    'specific': [
        'Reproduzir o fluxo ou bug em web/native com fixture determinística',
        'Implementar a correção sem remover contrato ou fluxo existente',
        'Cobrir loading, vazio, erro, offline e permissão negada',
        'Validar safe area, toque, contraste, foco, idioma e uso com uma mão',
        'Mockar câmera, galeria, GPS, mapa e filesystem conforme SDK 54',
        'Registrar plataforma testada, limitação conhecida e evidência do resultado',
    ],
}

for cfg in (agent1, agent2, agent3):
    lines = [f"# PantanalDex — {cfg['title']}: checklist operacional de 300 pontos", '',
             '> Regra: cada caixa só pode ser marcada após alteração verificável, teste, documentação, checks verdes, commit e PR. Planejamento isolado não conta.', '',
             '## Meta comum do MVP', '',
             'Entregar um MVP funcional com **no mínimo 500 espécies verificadas**, priorizando as espécies mais emblemáticas e frequentes do Pantanal. O catálogo deve manter licenciamento comercial auditável; nenhum dado, imagem, ocorrência ou conservação pode ser inventado.', '',
             '## Como contar', '',
             'Este arquivo contém exatamente 300 pontos: 50 passos com seis caixas cada. O Agente deve marcar a caixa somente quando houver evidência no repositório e no PR. Um passo pode permanecer bloqueado, mas precisa registrar causa, evidência, alternativa e responsável no HANDOFF.', '',
             '## Checklist', '']
    n = 1
    for i, phase in enumerate(phases, 1):
        lines.append(f'### Passo {i}/50 — {phase}')
        for item in cfg['specific']:
            lines.append(f'- [ ] {n:03d}. {item}.')
            n += 1
        lines.append('')
    lines += [
        '## Portão de entrega do agente', '',
        'O checklist só é considerado completo quando todos os pontos aplicáveis tiverem evidência, nenhum bloqueio estiver sem alternativa e o Agente 1 tiver um PR revisável. A meta de 500 espécies é uma meta de conteúdo verificado, não de registros apenas estruturais.', '',
        '### Comandos obrigatórios', '',
        '`pnpm check` · `pnpm lint` · `pnpm test` · `git diff --check` · `pnpm watchdog`', '',
        '### Regras GitHub', '',
        'Trabalhar em `conta-2-catalogo-ciclo-N`, `conta-3-qualidade-ciclo-N` ou `integracao-ciclo-N`; nunca alterar diretamente `main`. Abrir PR contra `main`, informar contagem, arquivos, testes, riscos e pendências, e nunca usar `git reset --hard`.',
    ]
    assert n == 301, (cfg['slug'], n)
    (root / f"{cfg['slug']}.md").write_text('\n'.join(lines) + '\n', encoding='utf-8')

print('generated=3 points_each=300 total=900')
