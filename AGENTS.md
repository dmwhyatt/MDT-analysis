# AGENTS.md

## Cursor Cloud specific instructions

`MDT-analysis` is intended to hold Python analysis scripts for a 3AFC (three-alternative
forced choice) melodic discrimination test. As of now the repository is a fresh scaffold:
it contains only `README.md`, `LICENSE`, and a standard Python `.gitignore` — there is no
committed source code, dependency manifest, test suite, lint config, or runnable service yet.

- Language/stack: Python (the `.gitignore` is the standard GitHub Python template, hinting at
  `venv`/`uv`/`poetry`, `pytest`, `ruff`/`mypy`, and possibly Jupyter/Streamlit for future work).
- A virtual environment lives at `.venv` (gitignored). Activate it with `. .venv/bin/activate`.
  The startup update script (re)creates it and installs dependencies from `requirements.txt`
  and/or `pyproject.toml` when those files exist, so no manual bootstrap is normally needed.
- System dependency `python3.12-venv` is required to create the venv and is baked into the VM;
  it is intentionally NOT in the update script (the update script must not install system deps).
- There is nothing to lint/test/build/run until source code and a dependency manifest are added.
  Once they are, run everything through the `.venv` interpreter (e.g. `.venv/bin/python -m pytest`,
  `.venv/bin/python -m ruff check .`).
